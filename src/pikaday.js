import defaultConfig from 'defaultConfig';
import {isDate, getRandomString} from 'utils';
import classNames from 'classnames';

let classesMap = {
    wraper: 'pika-single'
};

class Friday {
    isVisible = false;
    element = null;
    config = {};
    currentId = null;

    constructor(options) {
        // set random id for current instance
        this.currentId = getRandomString();
        // build configuration object
        this.config = this.buildConfig(options);

        let config = this.config;
        if (config.minDate) {
            this.setMinDate(config.minDate);
        }
        if (config.maxDate) {
            this.setMaxDate(config.maxDate);
        }

        this.element = document.createElement('div');
        this.element.className = classNames(classesMap.wraper, config.theme, {['is-rtl']: config.isRTL});

        if (config.field) {
            if (config.container) {
                config.container.appendChild(this.element);
            }
        }
    }

    render() {
        var opts = this._o,
            now = new Date(),
            days = getDaysInMonth(year, month),
            before = new Date(year, month, 1).getDay(),
            data = [],
            row = [];
        setToStartOfDay(now);
        if (opts.firstDay > 0) {
            before -= opts.firstDay;
            if (before < 0) {
                before += 7;
            }
        }
        var previousMonth = month === 0 ? 11 : month - 1,
            nextMonth = month === 11 ? 0 : month + 1,
            yearOfPreviousMonth = month === 0 ? year - 1 : year,
            yearOfNextMonth = month === 11 ? year + 1 : year,
            daysInPreviousMonth = getDaysInMonth(yearOfPreviousMonth, previousMonth);
        var cells = days + before,
            after = cells;
        while (after > 7) {
            after -= 7;
        }
        cells += 7 - after;
        for (var i = 0, r = 0; i < cells; i++) {
            var day = new Date(year, month, 1 + (i - before)),
                isSelected = isDate(this._d) ? compareDates(day, this._d) : false,
                isToday = compareDates(day, now),
                isEmpty = i < before || i >= (days + before),
                dayNumber = 1 + (i - before),
                monthNumber = month,
                yearNumber = year,
                isStartRange = opts.startRange && compareDates(opts.startRange, day),
                isEndRange = opts.endRange && compareDates(opts.endRange, day),
                isInRange = opts.startRange && opts.endRange && opts.startRange < day && day < opts.endRange,
                isDisabled = (opts.minDate && day < opts.minDate) ||
                    (opts.maxDate && day > opts.maxDate) ||
                    (opts.disableWeekends && isWeekend(day)) ||
                    (opts.disableDayFn && opts.disableDayFn(day));

            if (isEmpty) {
                if (i < before) {
                    dayNumber = daysInPreviousMonth + dayNumber;
                    monthNumber = previousMonth;
                    yearNumber = yearOfPreviousMonth;
                } else {
                    dayNumber = dayNumber - days;
                    monthNumber = nextMonth;
                    yearNumber = yearOfNextMonth;
                }
            }

            var dayConfig = {
                day: dayNumber,
                month: monthNumber,
                year: yearNumber,
                isSelected: isSelected,
                isToday: isToday,
                isDisabled: isDisabled,
                isEmpty: isEmpty,
                isStartRange: isStartRange,
                isEndRange: isEndRange,
                isInRange: isInRange,
                showDaysInNextAndPreviousMonths: opts.showDaysInNextAndPreviousMonths
            };

            row.push(renderDay(dayConfig));

            if (++r === 7) {
                if (opts.showWeekNumber) {
                    row.unshift(renderWeek(i - before, month, year));
                }
                data.push(renderRow(row, opts.isRTL));
                row = [];
                r = 0;
            }
        }
        return renderTable(opts, data, randId);
    }

    getElement() {
        return this.element;
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

        let numberOfMonths = parseInt(config.numberOfMonths, 10) || 1;
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
        if (Array.isArray(config.yearRange)) {
            var fallback = new Date().getFullYear() - 10;
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

module.exports = Friday;
