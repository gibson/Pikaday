import defaultConfig from 'defaultConfig';
import {isDate} from 'utils';
class Pikaday {
    constructor(options) {
        let config = this.buildConfig(options);
        if (config.minDate) {
            this.setMinDate(config.minDate);
        }
        if (config.maxDate) {
            this.setMaxDate(config.maxDate);
        }
    }

    buildConfig(userConfig) {
        let config = Object.assign({}, defaultConfig, userConfig);

        config.isRTL = (config.isRTL);

        config.field = (config.field && config.field.nodeName) ? config.field : null;

        config.theme = (typeof config.theme) === 'string' && config.theme ? config.theme : null;

        config.bound = (config.bound !== undefined ? config.field && config.bound : config.field);

        config.trigger = (config.trigger && config.trigger.nodeName) ? config.trigger : config.field;

        config.disableWeekends = (config.disableWeekends);

        config.disableDayFn = (typeof config.disableDayFn === 'function' ) ? config.disableDayFn : null;

        let numberOfMonths    = parseInt(config.numberOfMonths, 10) || 1;
        config.numberOfMonths = numberOfMonths > 4 ? 4 : numberOfMonths;

        if (!isDate(config.minDate)) {
            config.minDate = false;
        }
        if (!isDate(config.maxDate)) {
            config.maxDate = false;
        }
        if ((config.minDate && config.maxDate) && config.maxDate < config.minDate) {
            config.maxDate = config.minDate = false;
        }
        if (isArray(config.yearRange)) {
            var fallback        = new Date().getFullYear() - 10;
            config.yearRange[0] = parseInt(config.yearRange[0], 10) || fallback;
            config.yearRange[1] = parseInt(config.yearRange[1], 10) || fallback;
        } else {
            config.yearRange = Math.abs(parseInt(config.yearRange, 10)) || defaults.yearRange;
            if (config.yearRange > 100) {
                config.yearRange = 100;
            }
        }

        return config;
    }
}

export default Pikaday;
