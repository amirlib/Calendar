var model = {
    realYear: null, //real-world year
    realMonth: null, //rea-world month
    monthNames: [['January', 31], ['February', 28], ['March', 31], ['April', 30], ['May', 31], ['June', 30],
                 ['July', 31], ['August', 31], ['September', 30], ['October', 31], ['November', 30], ['December', 31]], //array with names and sizes of months
    monthCalendar: new Array(6), //array for saving the values of calendar
    daysName: [['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']],
    init: function() {
        const date = new Date();

        this.realYear = date.getFullYear();
        this.realMonth = date.getMonth();

        if(!sessionStorage.year) { //if session is empty, set real-world information
            sessionStorage.year = this.realYear;
            sessionStorage.month = this.realMonth;
            sessionStorage.dayMonth = date.getDate();
            sessionStorage.day = date.getDay();
            sessionStorage.dayPlace = (sessionStorage.dayMonth - sessionStorage.day + 7) % 7; //calculation of the first sunday in month(in number)
        }

        controller.isLeapYear(); //checking if current year is Leap-year

        for (let i = 0; i < 6; i++) { //making 2D array of monthCalendar
            this.monthCalendar[i] = new Array(7);
        }
    }
};

var controller = {
    init: function() {
        model.init();
        CalendarView.init();
    },
    setYear: function(val) {
        sessionStorage.year = val;
    },
    getYear: function() {
        return sessionStorage.year;
    },
    getRealYear: function() {
        return model.realYear;
    },
    setMonth: function(val) {
        if (val > 11) { //if new month is januar of new year
            val = 0;
            this.setYear(+this.getYear() + 1);
        } else if(val < 0) { //if new month is december of pre-year
            val = 11;
            this.setYear(+this.getYear() - 1);
        }
        sessionStorage.month = val;
    },
    getMonth: function() {
        return sessionStorage.month;
    },
    getRealMonth: function() {
        return model.realMonth;
    },
    getMonthName: function(val) {
        return model.monthNames[val][0];
    },
    getMonthSize: function(val) {
        if (val > 11) { //if val is januar of new year
            val = 0;
        } else if(val < 0) { //if val is december of pre-year
            val = 11;
        }
        return model.monthNames[val][1];
    },
    setDayMonth: function(val) {
        sessionStorage.dayMonth = val;
    },
    getDayMonth: function() {
        return sessionStorage.dayMonth;
    },
    setDay: function(val) {
        sessionStorage.day = val;
    },
    getDay: function() {
        return sessionStorage.day;
    },
    setDayPlace: function(val) {
        sessionStorage.dayPlace = val;
    },
    getDayPlace: function() {
        return sessionStorage.dayPlace;
    },
    buildCalendar: function(val) {
        let day = val - 7; //part of the calculation
        let sizePreMonth = this.getMonthSize(+this.getMonth() - 1); //get size of the pre-month
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 7; j++) {
                if(day <= 0) { //values of pre-month
                    model.monthCalendar[i][j] = sizePreMonth + day;
                } else if (day > this.getMonthSize(this.getMonth())) {
                    day = 1;
                    model.monthCalendar[i][j] = day; //values of next month
                } else {
                    model.monthCalendar[i][j] = day; //values if this month
                }
                day++;
            }
        }
    },
    getDayInCalendar: function(i , j) {
        return model.monthCalendar[i][j];
    },
    getDayName: function(val1, val2) {
        return model.daysName[val1][val2];
    },
    nextMonth: function() {
        this.setMonth(+controller.getMonth() + 1);
        controller.isLeapYear(); //checking if current year is Leap-year
        this.setDayPlace((+this.getDayPlace() - +this.getMonthSize(+this.getMonth() - 1) + 35) % 7);
    },
    beforeMonth: function() {
        this.setMonth(+controller.getMonth() - 1);
        controller.isLeapYear(); //checking if current year is Leap-year
        this.setDayPlace((+this.getDayPlace() + +this.getMonthSize(+this.getMonth()) - 14) % 7);
    },
    nextYear: function() {
        for(let i = 0; i < 12; i++) {
            this.nextMonth();
        }
    },
    beforeYear: function() {
        for(let i = 0; i < 12; i++) {
            this.beforeMonth();
        }
    },
    isCurrentDate: function() {
        if (controller.getMonth() != controller.getRealMonth() || controller.getYear() != controller.getRealYear()) {
            return false;
        }
        return true;
    },
    isLeapYear: function() { //checking if current year is Leap-year
        let getYear = this.getYear();
        if((getYear % 4 == 0 && getYear % 100 != 0) || getYear % 400 == 0) {
            model.monthNames[1][1] = 29;
        } else {
            model.monthNames[1][1] = 28;
        }
    }
};

var CalendarView = {
    init: function() {
        controller.buildCalendar(+controller.getDayPlace()); //building this month calendar

        this.render();
    },
    printCalendar: function() {
        let cell = 0;
        for(let i = 0; i < 6; i++) {
            for(let j = 0; j < 7; j++) {
                $("#cell"+cell).text(controller.getDayInCalendar(i, j));
                cell++;
            }
        }
    },
    paintCalendar: function() {
        let cell = 0;
        let dayMonth = controller.getDayMonth();
        let isCurrentDate = controller.isCurrentDate(); //cheking if parameters are the real-world parameters
        for(let i = 0; i < 6; i++) {
            for(let j = 0; j < 7; j++) {
                if(i == 0 || i == 1) { //2 first lines
                    if(controller.getDayInCalendar(i, j) >= 18 && controller.getDayInCalendar(i, j) <= 31) { //if values belong to current pre-month
                        $(".dayCell"+cell).removeClass('paintToday').removeClass('paintDayMonth').addClass('paintDayOther');
                    } else if(dayMonth == controller.getDayInCalendar(i, j) && dayMonth >= 1 && dayMonth <= 14 && isCurrentDate) { //if day is real-world day
                        $(".dayCell"+cell).removeClass('paintDayOther').removeClass('paintDayMonth').addClass('paintToday');
                    } else { //if values belong to the current month
                        $(".dayCell"+cell).removeClass('paintDayOther').removeClass('paintToday').addClass('paintDayMonth');
                    }
                } else if (i == 2 || i == 3) { //2 middlle lines
                    if(dayMonth == controller.getDayInCalendar(i, j) && isCurrentDate) { //if day is real-world day
                        $(".dayCell"+cell).removeClass('paintDayMonth').addClass('paintToday');
                    } else { //if values belong to the current month
                        $(".dayCell"+cell).removeClass('paintToday').addClass('paintDayMonth');
                    }
                } else { //2 last lines
                    if(controller.getDayInCalendar(i, j) >= 1 && controller.getDayInCalendar(i, j) <= 14) { //if values belong to current next month
                        $(".dayCell"+cell).removeClass('paintToday').removeClass('paintDayMonth').addClass('paintDayOther');
                    } else if(dayMonth == controller.getDayInCalendar(i, j) && dayMonth >= 18 && dayMonth <= 31 && isCurrentDate) { //if day is real-world day
                        $(".dayCell"+cell).removeClass('paintDayOther').removeClass('paintDayMonth').addClass('paintToday');
                    } else { //if values belong to the current month
                        $(".dayCell"+cell).removeClass('paintDayOther').removeClass('paintToday').addClass('paintDayMonth');
                    }
                }
                cell++;
            }
        }
    },
    printDaysName: function() {
        if($(".calendarFrame").outerWidth() >= 550) {
            for(let i = 0; i < 7; i++) {
                $("#dayName"+i).text(controller.getDayName(0, i));
            }
        } else {
            for(let i = 0; i < 7; i++) {
                $("#dayName"+i).text(controller.getDayName(1, i));
            }
        }
    },
    render: function() {
        $("#infoYear").text(controller.getYear());
        $("#infoMonth").text(controller.getMonthName(controller.getMonth()));

        this.printDaysName();
        $(window).resize(function() {
            CalendarView.printDaysName();
        });
        this.printCalendar();
        this.paintCalendar();
    }
};

$(document).ready(function() {
    controller.init();
});