/**
 * Sets the body field. The body field is the last text field available meant to display large bodies of text.
 * This can be used to display entire text interfaces.
 * You may even clear the title and subtitle fields in order to display more in the body field.
 * @memberOf simply
 * @param {string} text - The desired text to display.
 * @param {boolean} [clear] - If true, all other text fields will be cleared.
 */
simply.body = function(text, clear) {
  return simply.impl.textfield('body', text, clear);
};
/**
 * Vibrates the Pebble.
 * There are three support vibe types: short, long, and double.
 * @memberOf simply
 * @param {string} [type=short] - The vibe type.
 */
simply.vibe = function() {
  return simply.impl.vibe.apply(this, arguments);
};
/**
 * Enable scrolling in the Pebble UI.
 * When scrolling is enabled, up and down button presses are no longer forwarded to JavaScript handlers.
 * Single select, long select, and accel tap events are still available to you however.
 * @memberOf simply
 * @param {boolean} scrollable - Whether to enable a scrollable view.
 */
simply.scrollable = function(scrollable) {
  return simply.impl.scrollable.apply(this, arguments);
};
/**
 * Enable fullscreen in the Pebble UI.
 * Fullscreen removes the Pebble status bar, giving slightly more vertical display height.
 * @memberOf simply
 * @param {boolean} fullscreen - Whether to enable fullscreen mode.
 */
simply.fullscreen = function(fullscreen) {
  return simply.impl.fullscreen.apply(this, arguments);
};
/**
 * Set the Pebble UI style.
 * The available styles are 'small', 'large', and 'mono'. Small and large correspond to the system notification styles.
 * Mono sets a monospace font for the body textfield, enabling more complex text UIs or ASCII art.
 * @memberOf simply
 * @param {string} type - The type of style to set: 'small', 'large', or 'mono'.
 */
simply.style = function(type) {
  return simply.impl.style.apply(this, arguments);
};
simply.accelInit = function() {
  simply.state.accel = {
    rate: 100,
    samples: 25,
    subscribe: false,
    subscribeMode: 'auto',
    listeners: [],
  };
};
simply.accelAutoSubscribe = function() {
  var accelState = simply.state.accel;
  if (!accelState || accelState.subscribeMode !== 'auto') {
    return;
  }
  var subscribe = simply.countHandlers('accelData') > 0;
  if (subscribe !== simply.state.accel.subscribe) {
    return simply.accelConfig(subscribe, true);
  }
};
/**
 * The accelerometer configuration parameter for {@link simply.accelConfig}.
 * The accelerometer data stream is useful for applications such as gesture recognition when accelTap is too limited.
 * However, keep in mind that smaller batch sample sizes and faster rates will drastically impact the battery life of both the Pebble and phone because of the taxing use of the processors and Bluetooth modules.
 * @typedef {object} simply.accelConf
 * @property {number} [rate] - The rate accelerometer data points are generated in hertz. Valid values are 10, 25, 50, and 100. Initializes as 100.
 * @property {number} [samples] - The number of accelerometer data points to accumulate in a batch before calling the event handler. Valid values are 1 to 25 inclusive. Initializes as 25.
 * @property {boolean} [subscribe] - Whether to subscribe to accelerometer data events. {@link simply.accelPeek} cannot be used when subscribed. Simply.js will automatically (un)subscribe for you depending on the amount of accelData handlers registered.
 */
/**
 * Changes the accelerometer configuration.
 * See {@link simply.accelConfig}
 * @memberOf simply
 * @param {simply.accelConfig} accelConf - An object defining the accelerometer configuration.
 */
simply.accelConfig = function(opt, auto) {
  var accelState = simply.state.accel;
  if (typeof opt === 'undefined') {
    return {
      rate: accelState.rate,
      samples: accelState.samples,
      subscribe: accelState.subscribe,
    };
  } else if (typeof opt === 'boolean') {
    opt = { subscribe: opt };
  }
  for (var k in opt) {
    if (k === 'subscribe') {
      accelState.subscribeMode = opt[k] && !auto ? 'manual' : 'auto';
    }
    accelState[k] = opt[k];
  }
  return simply.impl.accelConfig.apply(this, arguments);
};
/**
 * Peeks at the current accelerometer values.
 * @memberOf simply
 * @param {simply.eventHandler} callback - A callback function that will be provided the accel data point as an event.
 */
simply.accelPeek = function(callback) {
  if (simply.state.accel.subscribe) {
    throw Error('Cannot use accelPeek when listening to accelData events');
  }
  return simply.impl.accelPeek.apply(this, arguments);
};
/**
 * Simply.js event. See all the possible event types. Subscribe to events using {@link simply.on}.
 * @typedef simply.event
 * @see simply.clickEvent
 * @see simply.accelTapEvent
 * @see simply.accelDataEvent
 */
/**
 * Simply.js button click event. This can either be a single click or long click.
 * Use the event type 'singleClick' or 'longClick' to subscribe to these events.
 * @typedef simply.clickEvent
 * @property {string} button - The button that was pressed: 'back', 'up', 'select', or 'down'. This is also the event subtype.
 */
simply.emitClick = function(type, button) {
  simply.emit(type, button, {
    button: button,
  });
};
/**
 * Simply.js accel tap event.
 * Use the event type 'accelTap' to subscribe to these events.
 * @typedef simply.accelTapEvent
 * @property {string} axis - The axis the tap event occurred on: 'x', 'y', or 'z'. This is also the event subtype.
 * @property {number} direction - The direction of the tap along the axis: 1 or -1.
 */
simply.emitAccelTap = function(axis, direction) {
  simply.emit('accelTap', axis, {
    axis: axis,
    direction: direction,
  });
};
/**
 * Simply.js accel data point.
 * Typical values for gravity is around -1000 on the z axis.
 * @typedef simply.accelPoint
 * @property {number} x - The acceleration across the x-axis.
 * @property {number} y - The acceleration across the y-axis.
 * @property {number} z - The acceleration across the z-axis.
 * @property {boolean} vibe - Whether the watch was vibrating when measuring this point.
 * @property {number} time - The amount of ticks in millisecond resolution when measuring this point.
 */
/**
 * Simply.js accel data event.
 * Use the event type 'accelData' to subscribe to these events.
 * @typedef simply.accelDataEvent
 * @property {number} samples - The number of accelerometer samples in this event.
 * @property {simply.accelPoint} accel - The first accel in the batch. This is provided for convenience.
 * @property {simply.accelPoint[]} accels - The accelerometer samples in an array.
 */
simply.emitAccelData = function(accels, callback) {
  var e = {
    samples: accels.length,
    accel: accels[0],
    accels: accels,
  };
  if (callback) {
    return callback(e);
  }
  simply.emit('accelData', e);
};
return simply;
})();
Pebble.require = require;
var require = simply.require;
