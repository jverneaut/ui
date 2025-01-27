import { matrix, map } from '@studiometa/js-toolkit/utils';
import AbstractSliderChild from './AbstractSliderChild.js';

/**
 * @typedef {SliderProgress & {
 *   $refs: {
 *     progress: HTMLElement
 *   },
 *   $parent: import('./Slider.js').default
 * }} SliderProgressInterface
 */

/**
 * SliderProgress class.
 */
export default class SliderProgress extends AbstractSliderChild {
  /**
   * Config.
   */
  static config = {
    name: 'SliderProgress',
    refs: ['progress'],
  };

  /**
   * Update the progress indicator.
   *
   * @this    {SliderProgressInterface}
   * @param   {number} index The new active index.
   * @returns {void}
   */
  update(index) {
    const unit = this.$refs.progress.clientWidth / this.$parent.indexMax;

    this.$refs.progress.style.transform = matrix({
      translateX: map(
        index,
        0,
        this.$parent.indexMax,
        (this.$refs.progress.clientWidth - unit) * -1,
        0
      ),
    });
  }
}
