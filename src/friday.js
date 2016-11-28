import defaultConfig from 'defaultConfig';
import {isDate, getRandomString} from 'utils';
import classNames from 'classnames';
import {getDaysInMonth, compareDates, isWeekend} from "./utils";
import {rewindToStartOfDay} from "./utils";

let classesMap = {
    wraper: 'pika-single'
};

const DAYS_IN_WEEK = 7;
const ONE_DAY_MS = 86400000;

class Friday {
    isVisible = false;
    element = null;
    config = {};
    currentId = null;
    selectedDay = null;

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
        this.element.className = classNames(
            classesMap.wraper,
            config.theme, {
                ['is-rtl']: config.isRTL
            });

        if (config.field) {
            if (config.container) {
                config.container.appendChild(this.element);
            }
        }
    }

    render() {
        // Initial values
        let year = 2016,
            month = 10,
            options = this.config,
            now = new Date(),
            daysInMonth = getDaysInMonth(year, month),
            daysPaddingBefore = new Date(year, month, 1).getDay(),
            data = [],
            row = [];

        rewindToStartOfDay(now);

        if (options.firstDay > 0) {
            // Move cells to left for start day
            daysPaddingBefore -= options.firstDay;
            if (daysPaddingBefore < 0) {
                daysPaddingBefore += DAYS_IN_WEEK;
            }
        }
        // Next months values
        let previousMonth = month === 0 ? 11 : month - 1,
            nextMonth = month === 11 ? 0 : month + 1,
            yearOfPreviousMonth = month === 0 ? year - 1 : year,
            yearOfNextMonth = month === 11 ? year + 1 : year,
            daysInPreviousMonth = getDaysInMonth(yearOfPreviousMonth, previousMonth);

        let cells = daysInMonth + daysPaddingBefore;
        // Add days padding after month
        cells += DAYS_IN_WEEK - cells % DAYS_IN_WEEK;

        for (let cell = 0, rowNumber = 0; cell < cells; cell++) {
            let {
                startRange, endRange, minDate, maxDate, disableWeekends, disableDayFn,
                showDaysInNextAndPreviousMonths, showWeekNumber
            } = this.config;
            let day = new Date(year, month, 1 + (cell - daysPaddingBefore)),
                isSelected = isDate(this.selectedDay) && compareDates(day, this.selectedDay),
                isToday = compareDates(day, now),
                isEmpty = cell < daysPaddingBefore || cell >= (daysInMonth + daysPaddingBefore), // TODO check second condition
                dayNumber = 1 + (cell - daysPaddingBefore),
                monthNumber = month,
                yearNumber = year,
                isStartRange = startRange && compareDates(startRange, day),
                isEndRange = endRange && compareDates(endRange, day),
                isInRange = startRange && endRange && startRange < day && day < endRange,
                isDisabled = (minDate && day < minDate) ||
                    (maxDate && day > maxDate) ||
                    (disableWeekends && isWeekend(day)) ||
                    (typeof disableDayFn === 'function' && options.disableDayFn(day));

            if (isEmpty) {
                if (cell < daysPaddingBefore) {
                    dayNumber = daysInPreviousMonth + dayNumber;
                    monthNumber = previousMonth;
                    yearNumber = yearOfPreviousMonth;
                } else {
                    dayNumber = dayNumber - daysInMonth;
                    monthNumber = nextMonth;
                    yearNumber = yearOfNextMonth;
                }
            }

            let dayConfig = {
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
                showDaysInNextAndPreviousMonths
            };

            row.push(this.renderDay(dayConfig));

            if (++rowNumber === 7) {
                if (showWeekNumber) {
                    row.unshift(this.renderWeek(cell - daysPaddingBefore, month, year));
                }
                data.push(this.renderRow(row, options.isRTL));
                row = [];
                rowNumber = 0;
            }
        }
        return this.renderTable(options, data);
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
            let fallback = new Date().getFullYear() - 10;
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

    renderDay(options) {
        if (options.isEmpty && !options.showDaysInNextAndPreviousMonths) {
            return '<td class="is-empty"></td>';
        }
        let ariaSelected = options.isSelected;
        let dayClass = classNames({
            'is-disabled': options.isDisabled,
            'is-today': options.isToday,
            'is-selected': options.isSelected,
            'is-inrange': options.isInRange,
            'is-startrange': options.isStartRange,
            'is-endrange': options.isEndRange,
            'is-outside-current-month': options.isEmpty && options.showDaysInNextAndPreviousMonths
        });
        return `
            <td data-day="${options.day}" class="${dayClass}" aria-selected="${ariaSelected.toString()}">
                <button class="pika-button pika-day" type="button" data-pika-year="${options.year}" data-pika-month="${options.month}" data-pika-day="${options.day}">
                ${options.day}
                </button>
            </td>`;
    }

    renderWeek(day, month, year) {
        // Lifted from http://javascript.about.com/library/blweekyear.htm, lightly modified.
        let firstJanuary = new Date(year, 0, 1),
            weekNum = Math.ceil((((new Date(year, month, day) - firstJanuary) / ONE_DAY_MS) + firstJanuary.getDay() + 1) / 7);
        return `<td class="pika-week">${weekNum}</td>`;
    }

    renderRow(days, isRTL) {
        if (isRTL) {
            days = days.reverse();
        }
        return `<tr>${days.join('')}</tr>`;
    }

    renderTable(options, data) {
        return `<table cellpadding="0" cellspacing="0" class="pika-table" role="grid" aria-labelledby="${this.currentId}">
                    ${renderHead(options)}${renderBody(data)}
                </table>`;
    }

    renderHead(options) { // todo finish him
        var i, arr = [];
        if (options.showWeekNumber) {
            arr.push('<th></th>');
        }
        for (i = 0; i < 7; i++) {
            arr.push('<th scope="col"><abbr title="' + renderDayName(options, i) + '">' + renderDayName(options, i, true) + '</abbr></th>');
        }
        return '<thead><tr>' + (options.isRTL ? arr.reverse() : arr).join('') + '</tr></thead>';
    }
}

module.exports = Friday;
