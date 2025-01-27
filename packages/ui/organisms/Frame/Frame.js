import { Base } from '@studiometa/js-toolkit';
import { nextFrame, historyPush } from '@studiometa/js-toolkit/utils';
import FrameAnchor from './FrameAnchor.js';
import FrameForm from './FrameForm.js';
import FrameTarget from './FrameTarget.js';

/**
 * Get the scroll position.
 * @returns {{ left: number, top: number }}
 */
function getScrollPosition() {
  return {
    left: window.pageXOffset,
    top: window.pageYOffset,
  };
}

/**
 * The fetch cache.
 * @type {Map<string, { promise: Promise<any>, status: 'pending'|'resolved'|'error', content: any }>}
 */
const cache = new Map();

/**
 * @typedef {Object} FrameOptions
 * @property {boolean} history
 * @property {'replace'|'prepend'|'append'} position
 * @property {string} target
 */

/**
 * @typedef {Frame & {
 *   $children: {
 *     FrameAnchor: FrameAnchor[],
 *     FrameForm: FrameForm[],
 *     FrameTarget: FrameTarget[],
 *     Frame: Frame[],
 *   }
 * }} FrameInterface
 */

/**
 * Class.
 */
export default class Frame extends Base {
  /**
   * Config.
   */
  static config = {
    name: 'Frame',
    emits: [
      'before-fetch',
      'after-fetch',
      'before-leave',
      'after-leave',
      'before-content',
      'after-content',
      'before-enter',
      'after-enter',
    ],
    log: true,
    components: {
      FrameAnchor,
      FrameForm,
      FrameTarget,
      Frame,
    },
    options: {
      history: Boolean,
    },
  };

  /**
   * Get uniq id.
   * @returns {string}
   */
  get id() {
    return this.$el.id;
  }

  /**
   * Get direct children.
   *
   * @this    {FrameInterface}
   * @param   {string} name
   * @returns {any[]}
   */
  getDirectChild(name) {
    if (!this.$children[name]) {
      return [];
    }

    if (!this.$children.Frame) {
      return this.$children[name];
    }

    return this.$children[name].filter((child) =>
      this.$children.Frame.every((frame) =>
        frame.$children[name] ? !frame.$children[name].includes(child) : true
      )
    );
  }

  /**
   * Get direct `FrameAnchor` children.
   * @returns {FrameAnchor[]}
   */
  get directChildFrameAnchor() {
    return this.getDirectChild('FrameAnchor');
  }

  /**
   * Get direct `FrameForm` children.
   * @returns {FrameForm[]}
   */
  get directChildFrameForm() {
    return this.getDirectChild('form');
  }

  /**
   * Get direct `FrameTarget` children.
   * @returns {FrameTarget[]}
   */
  get directChildFrameTarget() {
    return this.getDirectChild('FrameTarget');
  }

  /**
   * Mounted hook.
   * @returns {void}
   */
  mounted() {
    if (this.$options.history) {
      window.addEventListener('popstate', this);
    }
  }

  /**
   * Destroyed hook.
   * @returns {void}
   */
  destroyed() {
    window.removeEventListener('popstate', this);
  }

  /**
   * Dispatch events.
   * @param   {PopStateEvent} event
   * @returns {void}
   */
  handleEvent(event) {
    if (event.type === 'popstate') {
      this.onWindowPopstate(event);
    }

    if (event.type === 'beforeunload') {
      this.onWindowUnload();
    }
  }

  /**
   * Prevent scroll top on unload.
   *
   * @returns {void}
   */
  onWindowUnload() {
    const { history } = window;

    if (!history.state) {
      return;
    }

    history.replaceState(
      {
        ...history.state,
        scroll: getScrollPosition(),
      },
      ''
    );
  }

  /**
   * Go to the previous URL on `popstate` event.
   *
   * @param   {PopStateEvent} event
   * @returns {void}
   */
  onWindowPopstate(event) {
    this.goTo(window.location.href, event.state);
  }

  /**
   * Prevent click on `FrameAnchor`.
   *
   * @this    {FrameInterface}
   * @param   {MouseEvent} event
   * @param   {number} index
   * @returns {void}
   */
  onFrameAnchorFrameClick(event, index) {
    // Prevent propagation of nested frames
    if (!this.directChildFrameAnchor.includes(this.$children.FrameAnchor[index])) {
      return;
    }

    this.$log('onAFrameClick', event, index);
    event.preventDefault();
    const anchor = this.$children.FrameAnchor[index];

    // Do nothing when clicking links on the same page
    // @todo handle hash change
    if (anchor.href === window.location.href) {
      return;
    }

    this.goTo(anchor.href);
  }

  /**
   * Prevent submit on forms.
   *
   * @this    {FrameInterface}
   * @param   {SubmitEvent} event
   * @param   {number} index
   * @returns {void}
   */
  onFrameFormFrameSubmit(event, index) {
    // Prevent propagation of nested frames
    if (!this.directChildFrameForm.includes(this.$children.FrameForm[index])) {
      return;
    }

    this.$log('onFrameFormFrameSubmit', event);
    event.preventDefault();
    const form = this.$children.FrameForm[index];
    this.goTo(form.action);
  }

  /**
   * Parge an HTML string into a DOM object.
   * @param   {string} string
   * @returns {Document}
   */
  parseHTML(string = '') {
    return new DOMParser().parseFromString(string, 'text/html');
  }

  /**
   * Go to the given url.
   * @param   {string} url
   * @param   {null|{ top: number, left: number }} [scroll]
   * @returns {Promise<void>}
   */
  async goTo(url, scroll = null) {
    this.$log('goTo', url);
    const parsedUrl = new URL(url);

    if (parsedUrl.origin !== window.location.origin) {
      throw new Error('Cross origin request are not allowed.');
    }

    this.$emit('before-fetch', url);

    // @todo add option to use content as is or to parse it and extract the new frame
    const content = await this.fetch(url);
    const doc = this.parseHTML(content);
    const el = doc.querySelector(`#${this.id}`);
    const newFrame = new Frame(/** @type {HTMLElement} */ (el));
    newFrame.$children.registerAll();

    this.$emit('after-fetch', url, content);

    this.$emit('before-leave');
    // Leave all
    await Promise.all(this.directChildFrameTarget.map((target) => target.leave()));

    this.$emit('after-leave');
    this.$emit('before-content');

    // Update content
    // @todo insert non existing FrameTarget as well
    this.directChildFrameTarget.map((target, index) =>
      target.updateContent(newFrame.directChildFrameTarget[index])
    );

    // Push history
    if (this.$options.history) {
      document.title = doc.title;
      historyPush({ path: parsedUrl.pathname, search: parsedUrl.searchParams });
    }

    if (scroll) {
      document.scrollingElement.scrollTop = scroll.top;
      document.scrollingElement.scrollLeft = scroll.left;
    }

    // Update components
    await nextFrame();
    this.$root.$update();
    await nextFrame();

    this.$emit('after-content');
    this.$emit('before-enter');

    // Enter all
    await Promise.all(this.directChildFrameTarget.map((target) => target.enter()));

    this.$emit('after-enter');
  }

  /**
   * Fetch the given url.
   * @param   {string} url
   * @returns {Promise<string>}
   */
  async fetch(url) {
    const cached = cache.get(url);

    if (cached) {
      if (cached.status === 'pending') {
        return cached.promise;
      }

      return cached.content;
    }

    const promise = fetch(url);

    try {
      cache.set(url, {
        promise,
        status: 'pending',
        content: undefined,
      });

      const content = await promise.then((response) => response.text());

      cache.set(url, {
        promise,
        status: 'resolved',
        content,
      });

      return content;
    } catch (err) {
      cache.set(url, {
        promise,
        status: 'error',
        content: err,
      });

      return err;
    }
  }
}
