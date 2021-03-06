var plan = {
    /**
     * 初始化
     */
    init: function () {
        // 激活侧边栏
        $('[data-target="#ctrl-man"]').trigger('click').parent().find('li:eq(0) a').addClass('side-active');

        $("#plan-table").bootstrapTable({
            url: 'sys/control/plan/data',
            queryParams: function (params) {
                return {
                    offset: params.offset,
                    limit: params.limit,
                    id: $('#query-id').val().trim()
                }
            },
            columns: [{
                field: 'id',
                title: '方案编号'
            }, {
                field: 'planVolume',
                title: '灌溉量（m³）'
            }, {
                field: 'duration',
                title: '持续时长（分钟）'
            }, {
                formatter: function (value, row, index) {
                    return [
                        '<a type="button" class="btn btn-operate" href="javascript:plan.execute(' + "'" + row.id + "'" + ')">' +
                        '<i class="fa fa-wrench"></i> 执行' +
                        '</a>',
                        '<a type="button" class="btn btn-operate" href="javascript:plan.modifyPlan(' + "'" + row.id + "', '"
                        + row.planVolume + "', '" + row.duration  + "'" + ')">' +
                        '<i class="fa fa-pencil"></i> 修改' +
                        '</a>',
                        '<a type="button" class="btn btn-operate" href="javascript:plan.removePlan(' + "'" + row.id + "'" + ')">' +
                        '<i class="fa fa-times"></i> 删除' +
                        '</a>'
                    ].join('');
                },
                title: '操作'
            }],
            striped: true,
            pagination: true,
            sidePagination: 'server',
            pageSize: 10,
            pageList: [5, 10, 25, 50]
        });

        // 查询
        $('#query-btn').click(function () {
            $('#plan-table').bootstrapTable('selectPage', 1);
        });

        // 重置
        $('#reset-btn').click(function () {
            $('#query-tool-bar :text').val('');
            $('#plan-table').bootstrapTable('selectPage', 1);
        });

        // 新增
        $('#add-btn').click(function () {
            $('.modal :text').val('');
            $('#add-modal').modal('show');
        });

        $('#save-add').click(function () {
            plan.addPlan();
        });

        // 修改
        $('#save-modify').click(function () {
            plan.savePlan();
        });

        $('#exe-begin-time').daterangepicker({
            singleDatePicker: true,
            timePicker: true,
            timePickerIncrement: 10,
            locale: {
                applyLabel: '确认',
                cancelLabel: '取消',
                format: 'YYYY-MM-DD  h:mm A'
            }
        }).val('');
    },
    /**
     * 处理json中可能出现的null值
     */
    convertNull: function (param) {
        if (null == param) {
            return '';
        } else {
            return param;
        }
    },
    /**
     * 数据提交
     * @param path
     * @param id
     * @param planVolume
     * @param duration
     * @param planPs
     */
    sendRequest: function (path, id, planVolume, duration, planPs) {
        $.ajax({
            url: path,
            type: 'POST',
            data: {
                id: id,
                planVolume: planVolume,
                duration: duration,
                planPs: planPs
            },
            success: function (res) {
                var message = '操作失败';
                if (res.success) {
                    message = "操作成功！";
                }
                bootbox.alert({
                    title: '提示',
                    message: message
                });
                $("#plan-table").bootstrapTable('selectPage', 1);
            }
        });
    },
    /**
     * 新增方案
     */
    addPlan: function () {
        var planVolume = $('#addPlanVolume').val().trim();
        var duration = $('#addDuration').val().trim();
        var planPs = $('#addPlanPs').val().trim();

        $('#add-modal').modal('hide');

        var alertMessage = '';

        if (!/^[0-9]+([.][0-9]{1,2})?$/.test(planVolume) || !/^[0-9]+$/.test(duration)) {
            alertMessage = '请输入完整信息，灌溉量和时长应为数字（灌溉量最多保留两位小数，持续时长应为整数）'
        } else if (planPs.length > 80) {
            alertMessage = '地块备注限输入80个字符！';
        }

        if (alertMessage !== '') {
            bootbox.alert({
                title: '提示',
                message: alertMessage
            });
        } else {
            bootbox.confirm({
                title: '提示',
                message: '确认新增灌溉方案',
                callback: function (flag) {
                    if (flag) {
                        plan.sendRequest('sys/control/plan/add', null, planVolume, duration, planPs);
                    }
                }
            });
        }
    },
    /**
     * 修改方案
     * @param id
     * @param planVolume
     * @param duration
     * @param planPs
     */
    modifyPlan: function (id, planVolume, duration, planPs) {
        $('#modifyPlanVolume').val(planVolume);
        $('#modifyDuration').val(duration);
        $('#modifyPlanPs').val(planPs);
        $('#save-modify').attr('plan', id);

        $('#modify-modal').modal('show');
    },
    /**
     * 保存修改
     */
    savePlan: function () {
        var planVolume = $('#modifyPlanVolume').val().trim();
        var duration = $('#modifyDuration').val().trim();
        var planPs = $('#modifyPlanPs').val().trim();

        $('#modify-modal').modal('hide');

        var alertMessage = '';

        if (!/^[0-9]+([.][0-9]{1,2})?$/.test(planVolume) || !/^[0-9]+$/.test(duration)) {
            alertMessage = '请输入完整信息，灌溉量和时长应为数字（灌溉量最多保留两位小数，持续时长应为整数）'
        } else if (planPs.length > 80) {
            alertMessage = '地块备注限输入80个字符！';
        }

        if (alertMessage !== '') {
            bootbox.alert({
                title: '提示',
                message: alertMessage
            });
        } else {
            var id = $('#save-modify').attr('plan');
            bootbox.confirm({
                title: '提示',
                message: '确认修改灌溉方案',
                callback: function (flag) {
                    if (flag) {
                        plan.sendRequest('sys/control/plan/modify', id, planVolume, duration, planPs);
                    }
                }
            });
        }
    },
    /**
     * 删除
     */
    removePlan: function (id) {
        bootbox.confirm({
            title: '提示',
            message: '确认删除灌溉方案',
            callback: function (flag) {
                if (flag) {
                    plan.sendRequest('sys/control/plan/remove', id);
                }
            }
        });
    },
    /**
     * 执行方案
     * @param id id
     */
    execute: function (id) {
        var $time = $('#exe-begin-time');
        $time.val('');
        $('#exe-modal').modal('show');
        $('#plan-exe').click(function () {
            $('#exe-modal').modal('hide');
            // 格式化时间
            var split = $time.val().trim().split('  ');
            var date = split[0].trim();
            var time = split[1].trim();
            var hm = time.split(' ');
            var hour = hm[0].split(':')[0];
            var minute = hm[0].split(':')[1];
            if (hm[1].trim() == 'PM') {
                hour = parseInt(hour) + 12;
            }
            if (hour == 24) {
                hour = '00';
            } else if (hour < 10) {
                hour = '0' + hour;
            }
            var format = date + ' ' + hour + ':' + minute;
            bootbox.confirm({
                title: '提示',
                message: '确认执行该方案',
                callback: function (flag) {
                    if (flag) {
                        $.ajax({
                            url: 'sys/control/plan/execute',
                            type: 'POST',
                            data: {
                                planId: id,
                                start: format
                            },
                            success: function (res) {
                                var message = '操作失败';
                                if (res.success) {
                                    message = "操作成功！";
                                }
                                bootbox.alert({
                                    title: '提示',
                                    message: message
                                });
                            }
                        });
                    }
                }
            })
        });
    },
    /**
     * 发送ajax请求
     * @param url
     * @param method
     * @param params
     * @param callback
     */
    sendRequest: function (url, method, params, callback) {
        $.ajax({
            method: method,
            url: url,
            data: params,
            success: function (res) {
                if (undefined != callback) {
                    callback(res);
                }
            }
        });
    },
    vm: new Vue({
        el: '#wrapper',
        data: {
            sections: []
        },
        mounted: function () {
            var that = this;
            this.$nextTick(function () {
                plan.init();
                plan.sendRequest('sys/file/section/data', 'GET', null, function (res) {
                    that.sections = res.rows;
                })
            });
        }
    })
};