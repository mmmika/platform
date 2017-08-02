/**
 * Created by Gsy on 2017/7/26.
 */
(function() {
    'use strict';

    angular
        .module('jhipsterSampleApplicationApp')
        .controller('RunAlController', RunAlController);

    RunAlController.$inject = ['$state', '$scope', '$stateParams', 'GetServerProject', 'GetAlgorithmData', 'GetAlgorithmParams', 'GetServerData', 'runLocal', 'GetParameter'];

    function RunAlController ($state, $scope, $stateParams, GetServerProject, GetAlgorithmData, GetAlgorithmParams, GetServerData, runLocal, GetParameter) {
        var vm = this;
        vm.projects = [];
        vm.projectName = null;
        vm.checkList = [];
        vm.test = test;
        vm.serverData = [];
        vm.paramDes = [];
        vm.param = [];
        vm.results = [];
        vm.check = null;
        vm.alMLLib = null;
        vm.paramMllib = [];
        function test() {
            console.log(vm.checkList);
        }

        GetServerProject.get({}, function (res) {
            vm.projects = res;
            console.log(vm.projects);
            if ($stateParams.projectName == null && vm.projects.length > 0) {
                vm.projectName = vm.projects[0];
                console.log(vm.projectName);
            } else
                vm.projectName = $stateParams.projectName;

        }, function (res) {

        });

        var type="Algorithm";
        $scope.$watch('vm.projectName', function () {
            if (vm.projectName != null) {
                GetAlgorithmData.get({ProjectName:vm.projectName},function (res) {
                    console.log(res);
                    vm.algrithmData = res;
                }, function (result) {
                });
            }

        });

        $scope.$watch('vm.check', function (newvalue, oldvalue) {
            if (newvalue!="Mllib") {
                GetAlgorithmParams.get({ProjectName:vm.projectName, AlgorithmName:vm.algrithmData[newvalue]},
                    function (res) {
                        vm.paramDes = res;
                        console.log(vm.paramDes);
                        GetServerData.get({ProjectName:vm.projectName}, function (result) {
                            for (var i = 0; i< result.length; i++) {
                                vm.serverData[i] = result[i].split("+");
                                vm.checkList[i] = false;
                                if (vm.serverData[i][1] == '0') {
                                    vm.serverData[i][1] = false;
                                }else
                                    vm.serverData[i][1] = true;

                            }
                            console.log(vm.serverData);
                        }, function (res) {
                            console.log(res);
                        });


                    }, function (res) {
                        console.log(res);
                    });
            } else {
                if (vm.alMLLib!=null)
                    GetParameter.get({Algorithm: vm.alMLLib},  function (res) {
                        for (var i = 0; i< res.length; i++) {
                            vm.param[i] = res[i].split(":");
                        }

                        angular.copy(vm.param, vm.paramMllib);
                        console.log( vm.paramMllib);
                    }, function (res) {
                        console.log(res);
                    });

            }

        });

        $scope.$watch('vm.alMLLib', function (newvalue, oldvalue) {
            GetParameter.get({Algorithm: vm.alMLLib},  function (res) {
                for (var i = 0; i< res.length; i++) {
                    vm.param[i] = res[i].split(":");
                }

                angular.copy(vm.param, vm.paramMllib);
                console.log( vm.paramMllib);
            }, function (res) {
                console.log(res);
            });
        });

        vm.runAl = runAl;
        function runAl() {
            console.log(vm.param);
            var str = '{';
            for(var k = 0; k < vm.paramDes.length; k++) {
                str += "\""+vm.paramDes[k][0].toString()+"\"" + ":"; //加参
                if (vm.paramDes[k][2] == 'true')
                    str += "\"src/main/webappfiles/Project/"+vm.projectName+"/Data/" +vm.param[k].toString()+"\"" + ",";
                else
                    str += "\"" +vm.param[k].toString()+"\"" + ",";
            }
            str = str.substring(0, str.lastIndexOf(','));
            str += '}';
            console.log(str);
            console.log( JSON.parse(str));
            runLocal.get({ProjectName:vm.projectName, AlgorithmName:vm.algrithmData[vm.check], Params:str, isPython:true}, function (res) {
                console.log(res);
                vm.results = res;

            }, function (res) {

            });

        }

        vm.runMllibAl = runMllibAl;
        function runMllibAl() {
            
        }


    }
})();
