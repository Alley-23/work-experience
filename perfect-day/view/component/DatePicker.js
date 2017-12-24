import React from 'react';
import _     from 'underscore';

import Picker from './ScrollWheelPicker';

function isBigMonth(month) {
    return [1, 3, 5, 7, 8, 10, 12].indexOf(month) !== -1;
}

function isLeapYear(year) {
  return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
}

function getLastDateOfMonth (year, month) {
    var endDate = 30;

    if (isBigMonth(month)) {
        endDate = 31;
    } else if (month === 2) {
        if (isLeapYear(year)) {
            endDate = 29;
        } else {
            endDate = 28;
        }
    }
    return endDate;
}

function normalizeNumber (n) {
    return n < 10 ? '0' + n : '' + n;
}

const style = {
    datepicker: {
        padding: '20px'
    }
};

class DatePicker extends React.Component {
    constructor (props) {
        var start = props.start;
        var end   = props.end;
        var selected = props.selected;
        var selectedYear = 0;
        var selectedMonth = 0;
        var selectedDate = 0;
        var yearRange, monthRange, dateRange;
        super(props);

        if (!start) {
            start = new Date();
        }

        if (!end) {
            end = new Date(start.getTime() + 365 * 86400000);
        }

        if (!selected) {
            selected = start;
        }

        yearRange = _.range(start.getFullYear(), end.getFullYear() + 1);
        selectedYear = selected.getFullYear() - start.getFullYear();

        if (start.getFullYear() === end.getFullYear()) {
            monthRange = _.range(start.getMonth() + 1, end.getMonth() + 2);
            selectedMonth = selected.getMonth() - start.getMonth();

            if (start.getMonth() === end.getMonth()) {
                dateRange = _.range(start.getDate(), end.getDate() + 1);
                selectedDate = selected.getDate() - start.getDate();
            } else if (selected.getMonth() === start.getMonth()) {
                dateRange = _.range(
                    start.getDate(),
                    getLastDateOfMonth(start.getFullYear(), start.getMonth() + 1) + 1
                );
                selectedDate = selected.getDate() - start.getDate();
            } else if (selected.getMonth() === end.getMonth()) {
                dateRange = _.range(
                    1,
                    end.getDate() + 1
                );
                selectedDate = selected.getDate() - 1;
            } else {
                dateRange = _.range(
                    1,
                    getLastDateOfMonth(selected.getFullYear(), selected.getMonth() + 1) + 1
                );
                selectedDate = selected.getDate() - 1;
            }
        } else if (selected.getFullYear() === start.getFullYear()) {
            monthRange = _.range(start.getMonth() + 1, 13);
            selectedMonth = selected.getMonth() - start.getMonth();

            if (selected.getMonth() === start.getMonth()) {
                dateRange = _.range(
                    start.getDate(),
                    getLastDateOfMonth(start.getFullYear(), start.getMonth() + 1) + 1
                );
                selectedDate = selected.getDate() - start.getDate();
            } else {
                dateRange = _.range(
                    1,
                    getLastDateOfMonth(selected.getFullYear(), selected.getMonth() + 1) + 1
                );
                selectedDate = selected.getDate() - 1;
            }
        } else if (selected.getFullYear() === end.getFullYear()) {
            monthRange = _.range(1, end.getMonth() + 2);
            selectedMonth = selected.getMonth();

            selectedDate = selected.getDate() - 1;
            if (selected.getMonth() === end.getMonth()) {
                dateRange = _.range(
                    1,
                    end.getDate() + 1
                );
            } else {
                dateRange = _.range(
                    1,
                    getLastDateOfMonth(selected.getFullYear(), selected.getMonth() + 1) + 1
                );
            }
        } else {
            monthRange = _.range(1, 13);
            selectedMonth = selected.getMonth();
            dateRange = _.range(1, getLastDateOfMonth(selected.getFullYear(), selected.getMonth() + 1) + 1);
            selectedDate = selected.getDate() - 1;
        }

        this.state = {
            start: start,
            end: end,
            yearRange,
            monthRange,
            dateRange,
            selectedYear,
            selectedMonth,
            selectedDate
        };
    }

    getValue () {
        return [
            this.getYear(),
            normalizeNumber(this.getMonth()),
            normalizeNumber(this.getDate())
        ].join('-');
    }

    getYear () {
        return this.state.yearRange[this.state.selectedYear];
    }

    getMonth () {
        return this.state.monthRange[this.state.selectedMonth];
    }

    getDate () {
        return this.state.dateRange[this.state.selectedDate];
    }

    onSelectYear (i) {
        var newState = {
            selectedYear: i,
            selectedMonth: 0,
            selectedDate: 0
        };
        var startDate = 1;
        var endDate = 31;

        var year = this.state.yearRange[i];

        if (year === this.state.start.getFullYear()) {
            let month = this.state.start.getMonth() + 1;
            newState.monthRange = _.range(month, 13);

            endDate = getLastDateOfMonth(year, month);
            startDate = this.state.start.getDate();

        } else if (year === this.state.end.getFullYear()) {
            let month = this.state.end.getMonth() + 1;
            newState.monthRange = _.range(1, month + 1);

            endDate = this.state.end.getDate();
        } else {
            newState.monthRange = _.range(1, 13);
        }

        newState.dateRange = _.range(startDate, endDate + 1);

        this.setState(newState);
    }

    onSelectMonth (i) {
        var year = this.getYear();
        var newState = {
            selectedMonth: i,
            selectedDate: 0
        };
        var month = this.state.monthRange[i];
        var endDate = getLastDateOfMonth(year, month);
        var startDate = 1;

        if (
            year === this.state.start.getFullYear() &&
            month === this.state.start.getMonth() + 1
        ) {
            startDate = this.state.start.getDate();
        } else if (
            year === this.state.end.getFullYear() &&
            month === this.state.end.getMonth() + 1
        ) {
            endDate = this.state.end.getDate();
        }

        newState.dateRange = _.range(startDate, endDate + 1);

        this.setState(newState);
    }

    onSelectDate (i) {
        this.setState({
            selectedDate: i
        });
    }

    render () {
        return (
            <div style={ style.datepicker } className="row flex">
                <div className="col-flex">
                    <Picker
                        label="年"
                        options={ this.state.yearRange }
                        selected={ this.state.selectedYear }
                        onSelect={ this.onSelectYear.bind(this) }
                    />
                </div>
                <div className="col-flex">
                    <Picker
                        label="月"
                        options={ this.state.monthRange }
                        selected={ this.state.selectedMonth }
                        onSelect={ this.onSelectMonth.bind(this) }
                    />
                </div>
                <div className="col-flex">
                    <Picker
                        label="日"
                        options={ this.state.dateRange }
                        selected={ this.state.selectedDate }
                        onSelect={ this.onSelectDate.bind(this) }
                    />
                </div>
            </div>
        );
    }
}

export default DatePicker;