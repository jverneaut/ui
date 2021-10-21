import {Base, createApp} from '@studiometa/js-toolkit';
import * as components from '@studiometa/ui';


/**
 * Main App class.
 */
class App extends Base {
  /**
   * App config.
   * @return {Object}
   */
  static config = {
    log: true,
    name: 'App',
    components,
  };

  /**
   * Log a nice message when app is ready.
   *
   * @return {void}
   */
  mounted() {
    this.$log('mounted 🎉');
  }
}

export default createApp(App, document.documentElement);
