$(document).ready(function () {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyA0QQQRPwWU4opRFogsTKJeuZTrcIWIwas",
        authDomain: "iot-cd.firebaseapp.com",
        databaseURL: "https://iot-cd.firebaseio.com",
        projectId: "iot-cd",
        storageBucket: "iot-cd.appspot.com",
        messagingSenderId: "118359594209"
    };
    firebase.initializeApp(config);


    // Get rows to insert data
    var tempValue = $('#temp-value');
    var tempStatus = $('#temp-status');

    var humiValue = $('#humi-value');
    var humiStatus = $('#humi-status');

    var humiLandValue = $('#humi-land-value');
    var humiLandStatus = $('#humi-land-status');

    // Access to "Temp" element in Test database
    var databaseTemp = firebase.database().ref('Node 1/Temperature/Temp');
    var databaseHumi = firebase.database().ref('Node 1/Humidity/Humi');
    var databaseHumiLand = firebase.database().ref('Node 1/Soil moisture/HumidityLand');

    // Get Temp and Humidity threshold
    var tempMin = firebase.database().ref('Node 1/Temperature/Tmin');
    var tempMax = firebase.database().ref('Node 1/Temperature/Tmax');
    var humiMin = firebase.database().ref('Node 1/Humidity/Hmin');
    var humiMax = firebase.database().ref('Node 1/Humidity/Hmin');
    var humiLandMin = firebase.database('Node 1/Soil/Soil moisture/Smin');
    var humiLandMax = firebase.database('Node 1/Soil/Soil moisture/Smax');
    // Update param's thresholds
    $('#setting-btn').click(x => {
        var setTempUp = $('#temp-limit-up').val();
        var setTempDown = $('#temp-limit-down').val();
        var setHumiUp = $('#humi-limit-up').val();
        var setHumiDown = $('#humi-limit-down').val();
        var setHumiLandUp = $('#humi-land-limit-up').val();
        var setHumiLandDown = $('#humi-land-limit-down').val();

        tempMin.once('value', snap => {
            var tempMinValue = snap.val();

            tempMax.once('value', snap2 => {
                var tempMaxValue = snap2.val();

                if ((setTempUp !== '') && (setTempDown !== '')) {
                    if (setTempUp >= setTempDown) {
                        tempMax.set(setTempUp);
                        tempMin.set(setTempDown);
                    } else {
                        alert('Giới hạn trên phải lớn hơn giới hạn dưới!');
                    }
                } else if ((setTempUp === '') && (setTempDown !== '')) {
                    if (setTempDown <= tempMaxValue) {
                        tempMin.set(setTempDown);
                    } else {
                        alert('Giới hạn dưới phải nhỏ hơn giới hạn trên đang tồn tại. Giới hạn trên hiện tại: ' + tempMaxValue + '℃');
                    }
                } else if ((setTempDown === '') && (setTempUp !== '')) {
                    if (setTempUp >= tempMinValue) {
                        tempMax.set(setTempUp);
                    } else {
                        alert('Giới hạn trên phải nhỏ hơn giới hạn dưới đang tồn tại. Giới hạn dưới hiện tại: ' + tempMinValue + '℃');
                    }
                }
            })
        })


        humiMin.once('value', snap => {
            var humiMinValue = snap.val();

            humiMax.once('value', snap2 => {
                var humiMaxValue = snap2.val();

                if ((setHumiUp !== '') && (setHumiDown !== '')) {
                    if (setHumiUp >= setHumiDown) {
                        humiMax.set(setHumiUp);
                        humiMin.set(setHumiDown);
                    } else {
                        alert('Giới hạn trên phải lớn hơn giới hạn dưới!');
                    }
                } else if ((setHumiUp === '') && (setHumiDown !== '')) {
                    if (setHumiDown <= humiMaxValue) {
                        humiMin.set(setHumiDown);
                    } else {
                        alert('Giới hạn dưới phải nhỏ hơn giới hạn trên đang tồn tại. Giới hạn trên hiện tại: ' + humiMaxValue + '%');
                    }
                } else if ((setHumiDown === '') && (setHumiUp !== '')) {
                    if (setHumiUp >= humiMinValue) {
                        humiMax.set(setHumiUp);
                    } else {
                        alert('Giới hạn trên phải nhỏ hơn giới hạn dưới đang tồn tại. Giới hạn dưới hiện tại: ' + humiMinValue + '%');
                    }
                }
            })
        })


        humiLandMin.once('value', snap => {
            var humiLandMinValue = snap.val();

            humiLandMax.once('value', snap2 => {
                var humiLandMaxValue = snap2.val();

                if ((setHumiLandUp !== '') && (setHumiLandDown !== '')) {
                    if (setHumiLandUp >= setHumiLandDown) {
                        humiLandMax.set(setHumiLandUp);
                        humiLandMin.set(setHumiLandDown);
                    } else {
                        alert('Giới hạn trên phải lớn hơn giới hạn dưới!');
                    }
                } else if ((setHumiLandUp === '') && (setHumiLandDown !== '')) {
                    if (setHumiLandDown <= humiLandMaxValue) {
                        humiLandMin.set(setHumiLandDown);
                    } else {
                        alert('Giới hạn dưới phải nhỏ hơn giới hạn trên đang tồn tại. Giới hạn trên hiện tại: ' + humiMaxValue + '%');
                    }
                } else if ((setHumiLandDown === '') && (setHumiLandUp !== '')) {
                    if (setHumiLandUp >= humiLandMinValue) {
                        humiLandMax.set(setHumiLandUp);
                    } else {
                        alert('Giới hạn trên phải nhỏ hơn giới hạn dưới đang tồn tại. Giới hạn dưới hiện tại: ' + humiMinValue + '%');
                    }
                }
            })
        })
    })


    // Create an array to hold TEMP retreived from Firebase
    var dps = [];
    var i = 0;

    // Listen to value of param will added to its key
    databaseTemp.on('value', snap => {
        tempValue.text(snap.val());
        i++;

        // Save value to an array to set datapoints of chart
        dps.push({ x: i, y: snap.val(), markerSize: 5 });
        var chart = new CanvasJS.Chart("tempChartContainer", {
            axisY: {
                includeZero: true,
                suffix: '°C'
            },
            axisX: {
                interval: 1
            },
            data: [{
                type: "line",
                dataPoints: dps,
            }],
            zoomEnabled: true
        });

        var updateInterval = 1000;
        var dataLength = 20;

        var updateChart = function () {
            if (dps.length > dataLength) {
                dps.shift();
            }
            chart.render();
        };

        updateChart(dataLength);
        setInterval(function () {
            updateChart()
        }, updateInterval);
    })


    // Create an array to hold HUMIDITY retreived from firebase
    var dps2 = [];
    var j = 0;
    databaseHumi.on('value', snap => {
        humiValue.text(snap.val());
        j++;
        dps2.push({ x: j, y: snap.val(), markerSize: 5 });
        var chart = new CanvasJS.Chart("humiChartContainer", {
            axisY: {
                includeZero: true,
                suffix: '%'
            },
            axisX: {
                interval: 1
            },
            data: [{
                type: "line",
                dataPoints: dps2
            }],
            zoomEnabled: true,
        });

        var updateInterval = 1000;
        var dataLength = 20;

        var updateChart = function () {
            if (dps2.length > dataLength) {
                dps2.shift();
            }
            chart.render();
        };

        updateChart(dataLength);
        setInterval(function () {
            updateChart()
        }, updateInterval);
    })

    // Create an array to hold HUMIDITY LAND retreived from firebase
    var dps3 = [];
    var k = 0;
    databaseHumiLand.on('value', snap => {
        humiLandValue.text(snap.val());
        k++;
        dps3.push({ x: k, y: snap.val(), markerSize: 5 });
        var chart = new CanvasJS.Chart("humiLandChartContainer", {
            axisY: {
                includeZero: true,
                suffix: '%'
            },
            axisX: {
                interval: 1
            },
            data: [{
                type: "line",
                dataPoints: dps3
            }],
            zoomEnabled: true,
        });

        var updateInterval = 1000;
        var dataLength = 20;

        var updateChart = function () {
            if (dps3.length > dataLength) {
                dps3.shift();
            }
            chart.render();
        };

        updateChart(dataLength);
        setInterval(function () {
            updateChart()
        }, updateInterval);
    })

    // Check param threshold
    function checkThreshold(minValue, maxValue, actValue, id) {
        var minArray;
        var maxArray;
        var act;

        minValue.on('value', snap => {
            minArray = snap.val();

            maxValue.on('value', snap2 => {
                maxArray = snap2.val();

                actValue.on('value', snap3 => {
                    act = snap3.val();
                    a = parseInt(minArray);
                    b = parseInt(maxArray);
                    c = parseInt(act);

                    if (c < a) {
                        id.text('Dưới ngưỡng cho phép');
                        id.css({
                            'color': 'red',
                            'font-weight': 'bold'
                        })
                    } else if (c > b) {
                        id.text('Trên ngưỡng cho phép');
                        id.css({
                            'color': 'red',
                            'font-weight': 'bold'
                        })
                    } else if ((c >= a) && (c <= b)) {
                        id.text('Trong ngưỡng cho phép');
                    }
                })
            })
        })
    }

    checkThreshold(tempMin, tempMax, databaseTemp, tempStatus);
    checkThreshold(humiMin, humiMax, databaseHumi, humiStatus);
    checkThreshold(humiLandMin, humiLandMax, databaseHumiLand, humiLandStatus);



    // Check if params greater or less than its threshold
    // function checkParamStatus( value, min, max ) {
    //     this.value = parseInt(value);
    //     this.min =parseInt( min );
    //     this.max =parseInt( max );

    //     console.log( value );
    //     console.log( min );
    //     console.log( max );

    //     if ( value < min ) {
    //         return 'Dưới ngưỡng cho phép';
    //     } else if ( value > max ) {
    //         return 'Trên ngưỡng cho phép'
    //     } else if ( ( value >= min ) && ( value <= max ) ){
    //         return 'Trong ngưỡng cho phép';
    //     }
    //     return false;
    // }

    // // Check limit of param
    // tempStatus.text( checkParamStatus( databaseTemp, tempMin, tempMax ) );
    // humiStatus.text( checkParamStatus( databaseHumi, humiMin, humiMax ) );

    // var device2 = firebase.database().ref().child( 'Device_2' );

    // Set status for devices
    var device1 = firebase.database().ref('Node 1/Control/Device1');
    var device2 = firebase.database().ref('Node 1/Control/Device2');
    var device3 = firebase.database().ref('Node 1/Control/Device3');
    var device4 = firebase.database().ref('Node 1/Control/Device4');
    var device5 = firebase.database().ref('Node 1/Control/Device4');
    var dvStatus1;
    var dvStatus2;
    var dvStatus3;
    var dvStatus4;

    // Click button to On / Off devices in list
    function onOffBtn(btnID) {
        var id = btnID.substr(3, (btnID.length));
        var device = firebase.database().ref('Node 1/Control/Device' + id);
        var x;
        device.on('value', snap => {
            x = snap.val();
        })
        if (x == 1) {
            device.set('0')
        } else {
            device.set('1');
        }
    }

    // Check device status
    function deviceStatus(deviceName, dv, btn) {
        deviceName.on('value', snap => {
            var setStatus;
            if (snap.val() == 1) {
                $('#' + dv).text('Đang Bật');
                $('#' + btn).removeClass('btn-default');
                $('#' + btn).removeClass('btn-success');
                $('#' + btn).addClass('btn-danger');
                $('#' + btn).html('Tắt');
            } else {
                $('#' + dv).text('Đang Tắt');
                $('#' + btn).removeClass('btn-default');
                $('#' + btn).removeClass('btn-danger');
                $('#' + btn).addClass('btn-success');
                $('#' + btn).html('Bật');
            }

        })
    }

    deviceStatus(device1, 'dv1', 'btn1');
    deviceStatus(device2, 'dv2', 'btn2');
    deviceStatus(device3, 'dv3', 'btn3');
    deviceStatus(device4, 'dv4', 'btn4');
    deviceStatus(device5, 'dv5', 'btn5');


});
