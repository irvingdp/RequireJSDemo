//uploader
var g_isUploading = false;
//selectStr
var g_selectStrProduct = "製品名を選択してください。";
var g_selectStrProductVer = "バージョンを選択してください。";
var g_selectStrProductOS = "OSを選択してください。";
//dropdownlist
var g_jsonProductVerAndOS;
//popup
var g_newWindow = null;
//page type
var g_PageType = getPageType();
var g_lblSRTypeValue = '' ;
var g_lblSRTypeDisplayedText = '';
$(document).ready(function () {
    alert($.fn.jquery);
//no need to check zip
//    if (g_PageType == 've' && $('#hid_Corp_Cons_MalwareAtt_None_Zip').val() == 'y') {
//        $("#divMultipleCompression").show();
//        init_uploadify_filterZipRar();
//    }
//    else
        init_uploadify_no_filter();

    function init_uploadify_no_filter() {
        //uploader
        $('#fileUploader').uploadify({
            'uploader': '../Scripts/uploadify/uploadify.swf',
            'script': '../WebService/UploadWebSrc.ashx?queryString=sharefolder%26pageType=' + g_PageType,
            'auto': true,
            'queueID': 'uploadQueue',
            'queueSizeLimit': 1,
            'simUploadLimit': 1,
            'removeCompleted': false,
            'sizeLimit': 51200000,
            // Button settings
            'cancelImg': '../Scripts/uploadify/cancel.png',
            'buttonImg': '../image/JPSRF/button_upload.gif',
            'width': 153,
            'height': 33,
            'completedString': '',
            'onSelect': function (event, ID, fileObj) {
                g_isUploading = true;
            },
            'onComplete': function (event, ID, fileObj, response, data) {
                if (response.search("result=failed") != -1) {
                    doUploadifyFailed('upload failed,Please try again!');
                    return;
                }
                else if (response.search("result=success") != -1) {
                    $(".uploadifyQueueItem .fileName").html('添付ファイル:' + fileObj.name);
                    $("#hidUploadFilePath").val(response.split(',')[1].replace('filepath=', ''));
                    $("#hidOriginFileName").val(fileObj.name);
                    //alert("success!" + "::destFilePath:" + response.split(',')[1].replace('filepath=', '') + "::originFileName:" + fileObj.name);
                    doUploadifySuccess();
                    return;
                }
                else {
                    doUploadifyFailed("unknow error,Please try again!");
                    return;
                }
            },
            'onProgress': function (event, ID, fileObj, data) {
                g_isUploading = true;
                return;
            },
            'onError': function (event, ID, fileObj, errorObj) {
                if (errorObj.type === "File Size")
                    doUploadifyFailed('アップロードファイルのサイズは50MB以下にしてください。');
                else
                    doUploadifyFailed(errorObj.type + ' Error: ' + errorObj.info + " ,Please try again!");

                return;
            },
            'onCancel': function (event, ID, fileObj, data) {
                $("#hidUploadFilePath").val('');
                $("#hidOriginFileName").val('');
                g_isUploading = false;
                return;
            }
        });
    }

    function init_uploadify_filterZipRar() {
        //uploader
        $('#fileUploader').uploadify({
            'uploader': '../Scripts/uploadify/uploadify.swf',
            'script': '../WebService/UploadWebSrc.ashx?queryString=sharefolder%26pageType=' + g_PageType,
            'auto': true,
            'queueID': 'uploadQueue',
            'queueSizeLimit': 1,
            'simUploadLimit': 1,
            'removeCompleted': false,
            'sizeLimit': 51200000,
            // Button settings
            'cancelImg': '../Scripts/uploadify/cancel.png',
            'buttonImg': '../image/JPSRF/button_upload.gif',
            'width': 153,
            'height': 33,
            'completedString': '',
            'fileExt': '*.zip;*.rar',
            'fileDesc': 'ZIP/RAR File',
            'onSelect': function (event, ID, fileObj) {
                if (!(fileObj.type.toLowerCase() == '.zip' || fileObj.type.toLowerCase() == '.rar')) {
                    alert('please select .zip or .rar file to upload.');
                    return false;
                }
                g_isUploading = true;
            },
            'onComplete': function (event, ID, fileObj, response, data) {
                if (response.search("result=failed") != -1) {
                    doUploadifyFailed('upload failed,Please try again!');
                    return;
                }
                else if (response.search("result=success") != -1) {
                    $(".uploadifyQueueItem .fileName").html('添付ファイル:' + fileObj.name);
                    $("#hidUploadFilePath").val(response.split(',')[1].replace('filepath=', ''));
                    $("#hidOriginFileName").val(fileObj.name);
                    //alert("success!" + "::destFilePath:" + response.split(',')[1].replace('filepath=', '') + "::originFileName:" + fileObj.name);
                    doUploadifySuccess();
                    return;
                }
                else {
                    doUploadifyFailed("unknow error,Please try again!");
                    return;
                }
            },
            'onProgress': function (event, ID, fileObj, data) {
                g_isUploading = true;
                return;
            },
            'onError': function (event, ID, fileObj, errorObj) {
                if (errorObj.type === "File Size")
                    doUploadifyFailed('アップロードファイルのサイズは50MB以下にしてください。');
                else
                    doUploadifyFailed(errorObj.type + ' Error: ' + errorObj.info + " ,Please try again!");

                return;
            },
            'onCancel': function (event, ID, fileObj, data) {
                $("#hidUploadFilePath").val('');
                $("#hidOriginFileName").val('');
                g_isUploading = false;
                return;
            }
        });
    }

    //#region start drop down list evenhandler
    $("#ddlProduct").addOption("", g_selectStrProduct);
    $("#ddlProductOS").addOption("", g_selectStrProductOS);
    $("#ddlProductVer").addOption("", g_selectStrProductVer);
    $("#ddlProduct").change(function () {
        GetProductVersion(true, $(this).val());
        if ($("#ddlProduct").val() != "")
            toggleActivexError(false, 'imgProductActivexError');

    });
    $("#ddlProductVer").change(function () {
        var productVer = $(this).val();
        GetProductOS(productVer);
        if ($("#ddlProductVer").val() != "")
            toggleActivexError(false, 'imgProductVersionActivexError');
    });
    $("#ddlProductOS").change(function () {
        if ($("#ddlProductOS").val() != "")
            toggleActivexError(false, 'imgProductOSActivexError');
    });
    //#endregion start drop down list evenhandler

    //#region start activeX event handler
    $("#imgDetectSnrNo").click(function () {

        activexBindControls();

        if (trim($("#txtSerialNo1").val()) == '' ||
            trim($("#txtSerialNo2").val()) == '' ||
            trim($("#txtSerialNo3").val()) == '' ||
            trim($("#txtSerialNo4").val()) == '' ||
            trim($("#txtSerialNo5").val()) == '') {
            toggleActivexError(true, 'imgSrActivexError')
        }
        else {
            toggleActivexError(false, 'imgSrActivexError')
        }

        if ($("#ddlProduct").val() != '')
            toggleActivexError(false, 'imgProductActivexError')
        else
            toggleActivexError(true, 'imgProductActivexError')

        if ($("#ddlProductVer").val() != '')
            toggleActivexError(false, 'imgProductVersionActivexError')
        else
            toggleActivexError(true, 'imgProductVersionActivexError')

        if ($("#ddlProductOS").val() != '')
            toggleActivexError(false, 'imgProductOSActivexError')
        else
            toggleActivexError(true, 'imgProductOSActivexError')
    });
    $("#imgDetectGuid").click(function () {
        var env = CheckUserEnv();
        if (env == "ie") // go to real ActiveX program 
        {
            var activex = document.getElementById("VBInfoOcx");
            if (activex.object != null) {
                var inJson = activex.object.GetPCInfo();
                var jsonResult = $.evalJSON(inJson);
                $("#txtGuid").val(jsonResult.Guid);
            }
        }
    });
    //#endregion start activeX event handler

    //#region start validator event handler
    jQuery.validator.addMethod("checkEmail", function (value, element) {
        var emailaddress = $('#txtEmailUsername').val() + '@' + $('#txtEmailDomain').val();
        var emailRegxp = /^[\\~a-zA-Z0-9._-]+@[\\~a-zA-Z0-9._-]+\.[a-zA-Z]{2,4}$/;
        if (emailRegxp.test(emailaddress)) {
            $('#txtEmailUsername').removeClass("error");
            $('#txtEmailDomain').removeClass("error");
            return true;
        }
        else {
            $('#txtEmailUsername').addClass("error");
            $('#txtEmailDomain').addClass("error");
            return false;
        }
    }, '<br />「メールアドレス」の入力が有効ではありません。，username@example.co.jp のような形式で入力してください');
    jQuery.validator.addMethod("doubleCheckEmail", function (value, element) {
        var emailaddress = $('#txtEmailUsername').val() + '@' + $('#txtEmailDomain').val();
        var conEmailAddress = $('#txtConEmailUsername').val() + '@' + $('#txtConEmailDomain').val();
        if (emailaddress.toLowerCase() == conEmailAddress.toLowerCase()) {
            $('#txtConEmailUsername').removeClass("error");
            $('#txtConEmailDomain').removeClass("error");
            return true;
        }
        else {
            $('#txtConEmailUsername').addClass("error");
            $('#txtConEmailDomain').addClass("error");
            return false;
        }
    }, '<br />「メールアドレス」が確認用のものと一致していません');
    jQuery.validator.addMethod("checkPatternNum", function (value, element) {
        if ($('#txtPatternNum').val() != '' && getPageType() == "ve") {
            if (chkPattern($('#txtPatternNum').val())) {
                $('#txtPatternNum').removeClass("error");
                return true;
            }
            else {
                $('#txtPatternNum').addClass("error");
                return false;
            }
        }
        else {
            $('#txtPatternNum').removeClass("error");
            return true;
        }
    }, '<br />「パターンファイル番号」はドットと半角数字で入力してください。\n(例)1.655.00');
    jQuery.validator.addMethod("checkSNisVaild", function (value, element) {
        var serialNumber = $('#txtSerialNo1').val() + $('#txtSerialNo2').val() + $('#txtSerialNo3').val() + $('#txtSerialNo4').val() + $('#txtSerialNo5').val();
        var errorMessage = '';
        if (trim(serialNumber) == '') {
            errorMessage = 'シリアル番号を入力してください。';
            snValidatorChangeStyle(false, errorMessage);
            //showSnError(errorMessage, false, false);
            return false;
        } else if (trim(serialNumber).length < 9) {
            errorMessage = 'シリアル番号が正しくありません。';
            snValidatorChangeStyle(false, errorMessage);
            //showSnError(errorMessage, false, false);
            return false;
        }
        else {
            var fullSerialNumber = $('#txtSerialNo1').val() + "-" + $('#txtSerialNo2').val() + "-" + $('#txtSerialNo3').val() + "-" + $('#txtSerialNo4').val() + "-" + $('#txtSerialNo5').val();
            var checkSRresult = false;
            $.ajax({
                url: '../WebService/SerialNumValidationHandler.ashx',
                type: 'GET',
                cache: false,
                async: false,
                data: { SRType: g_lblSRTypeValue, SerialNum: fullSerialNumber, Segment: 'Consumer' },
                error: function (xhr, ajaxOptions, thrownError) {
                    alert("System Error! Please try it later.");
                    checkSRresult = false;
                },
                success: function (response) {
                    if (response == '') {
                        checkSRresult = false;
                    }
                    else {
                        var jsonResult = $.evalJSON(response);
                        if (jsonResult.Key == "True") {
                            checkSRresult = true;
                        }
                        else {
                            errorMessage = jsonResult.Value;
                            checkSRresult = false;
                        }
                    }
                },
                complete: function (response) {
                }
            });
            snValidatorChangeStyle(checkSRresult, errorMessage);
            //showSnError(errorMessage, true, checkSRresult);
            //showSnError('', false, true);
            return checkSRresult;
        }

    }, '');
    jQuery.validator.addMethod("checkName", function (value, element) {
        if (trim($('#txtFirstName').val()) == '' || trim($('#txtLastName').val()) == '') {
            $('#txtFirstName').addClass("error");
            $('#txtLastName').addClass("error");
            return false;
        }
        else {
            $('#txtFirstName').removeClass("error");
            $('#txtLastName').removeClass("error");
            return true;
        }
    }, '<br />姓（名字）を入力してください。');
    jQuery.validator.addMethod("checkPhoneIsEmpty", function (value, element) {
        var numberExp = /^\d+$/;
        if (trim($('#txtPhoneNo1').val()) == '' || trim($('#txtPhoneNo2').val()) == '' || trim($('#txtPhoneNo3').val()) == '') {
            $('#txtPhoneNo1').addClass("error");
            $('#txtPhoneNo2').addClass("error");
            $('#txtPhoneNo3').addClass("error");
            return false;
        }
        else {
            $('#txtPhoneNo1').removeClass("error");
            $('#txtPhoneNo2').removeClass("error");
            $('#txtPhoneNo3').removeClass("error");
            return true;
        }
    }, '<br />「電話番号」を入力してください');
    jQuery.validator.addMethod("checkPhoneIsNum", function (value, element) {
        var numberExp = /^\d+$/;
        if (numberExp.test($('#txtPhoneNo1').val()) &&
            numberExp.test($('#txtPhoneNo2').val()) &&
            numberExp.test($('#txtPhoneNo3').val())
        ) {
            $('#txtPhoneNo1').removeClass("error");
            $('#txtPhoneNo2').removeClass("error");
            $('#txtPhoneNo3').removeClass("error");
            return true;
        }
        else {
            $('#txtPhoneNo1').addClass("error");
            $('#txtPhoneNo2').addClass("error");
            $('#txtPhoneNo3').addClass("error");
            return false;
        }
    }, '<br />「電話番号」は半角数字で入力してください');
    jQuery.validator.addMethod("checkPhoneLen", function (value, element) {
        var phnoeNo = $('#txtPhoneNo1').val() + $('#txtPhoneNo2').val() + $('#txtPhoneNo3').val();
        if (phnoeNo.length > 15) {
            $('#txtPhoneNo1').addClass("error");
            $('#txtPhoneNo2').addClass("error");
            $('#txtPhoneNo3').addClass("error");
            return false;
        }
        else {
            $('#txtPhoneNo1').removeClass("error");
            $('#txtPhoneNo2').removeClass("error");
            $('#txtPhoneNo3').removeClass("error");
            return true;
        }
    }, '<br />「電話番号」のケタ数が多すぎます，確認してください');
    jQuery.validator.addMethod("checkDescript", function (value, element) {
        if (trim($('#txtProblemDescript').val()) == '') {
            $('#txtProblemDescript').addClass("error");
            return false;
        }
        else {
            $('#txtProblemDescript').removeClass("error");
            return true;
        }
    }, '<br />「お問い合わせ内容」を入力してください');
    jQuery.validator.addMethod("checkTotalTextAreaLen", function (value, element) {
        var txtDescript = $('#txtProblemDescript').val();
        var txtUrlDescript = $('#txtUrlDescript').val();

        if (getPageType() == "ve") {
            if (txtDescript.length + txtUrlDescript.length > 15000) {
                $('#txtProblemDescript').addClass("error");
                $('#txtUrlDescript').addClass("error");
                return false;
            }
            else {
                $('#txtProblemDescript').removeClass("error");
                $('#txtUrlDescript').removeClass("error");
                return true;
            }
        } else if (getPageType() == "cs" || getPageType() == "ts") {
            if (txtDescript.length > 15000) {
                $('#txtProblemDescript').addClass("error");
                return false;
            }
            else {
                $('#txtProblemDescript').removeClass("error");
                return true;
            }
        }
        else {
            return false;
        }
    }, '<br />お問合せ内容として入力いただいている文字数の合計を，15000文字程度にした上で再度登録をお願いします');
    jQuery.validator.addMethod("checkProduct", function (value, element) {
        if (trim($('#ddlProduct').val()) == '') {
            $('#ddlProduct').addClass("error");
            return false;
        }
        else {
            $('#ddlProduct').removeClass("error");
            return true;
        }
    }, '<br />「製品」が選択されていません。');
    jQuery.validator.addMethod("checkProductVer", function (value, element) {
        if (trim($('#ddlProductVer').val()) == '') {
            $('#ddlProductVer').addClass("error");
            return false;
        }
        else {
            $('#ddlProductVer').removeClass("error");
            return true;
        }
    }, '<br />「製品バージョン」が選択されていません ，選択肢にない場合は「バージョン不明」を選択してください');
    jQuery.validator.addMethod("checkProductOS", function (value, element) {
        if (trim($('#ddlProductOS').val()) == '') {
            $('#ddlProductOS').addClass("error");
            return false;
        }
        else {
            $('#ddlProductOS').removeClass("error");
            return true;
        }
    }, '<br />「使用OS」が選択されていません');
    jQuery.validator.addMethod("checkSpinIsNum", function (value, element) {
        if ($('#txtSpnid').val() != '' && getPageType() != "cs") {
            if (chkPattern($('#txtSpnid').val())) {
                $('#txtSpnid').removeClass("error");
                return true;
            }
            else {
                $('#txtSpnid').addClass("error");
                return false;
            }
        }
        else {
            $('#txtSpnid').removeClass("error");
            return true;
        }
    }, '<br />「SPNID」はドットと半角数字で入力してください。');
    jQuery.validator.addMethod("checkGuid", function (value, element) {
        if ($('#txtGuid').val() != '' && getPageType() != "cs") {
            if (IsGUID($('#txtGuid').val())) {
                $('#txtGuid').removeClass("error");
                return true;
            }
            else {
                $('#txtGuid').addClass("error");
                return false;
            }
        }
        else {
            $('#txtGuid').removeClass("error");
            return true;
        }
    }, '<br/>GUIDが正しくありません。不明な場合は空欄でフォームを送信してください。');
    //#endregion validator event handler

    //#region start other control event handler
    $("#txtSerialNo1").keyup(function () {
        ToUpperCase(this); checkSerialNoMaxLen('txtSerialNo1', 'txtSerialNo2'); checkSerialNumberIsFillIn();
    });
    $("#txtSerialNo1").change(function () {
        isDoubleByte(this);
    });
    $("#txtSerialNo2").keyup(function () {
        ToUpperCase(this); checkSerialNoMaxLen('txtSerialNo2', 'txtSerialNo3'); checkSerialNumberIsFillIn();
    });
    $("#txtSerialNo2").change(function () {
        isDoubleByte(this);
    });
    $("#txtSerialNo3").keyup(function () {
        ToUpperCase(this); checkSerialNoMaxLen('txtSerialNo3', 'txtSerialNo4'); checkSerialNumberIsFillIn();
    });
    $("#txtSerialNo3").change(function () {
        isDoubleByte(this);
    });
    $("#txtSerialNo4").keyup(function () {
        ToUpperCase(this); checkSerialNoMaxLen('txtSerialNo4', 'txtSerialNo5'); checkSerialNumberIsFillIn();
    });
    $("#txtSerialNo4").change(function () {
        isDoubleByte(this);
    });
    $("#txtSerialNo5").keyup(function () {
        ToUpperCase(this); checkSerialNoMaxLen('txtSerialNo5', 'ddlProduct'); checkSerialNumberIsFillIn();
    });
    $("#txtSerialNo5").change(function () {
        isDoubleByte(this);
    });
    //    $("#txtPhoneNo1").keyup(function () {
    //        checkSerialNoMaxLen('txtPhoneNo1', 'txtPhoneNo2');
    //    });
    //    $("#txtPhoneNo2").keyup(function () {
    //        checkSerialNoMaxLen('txtPhoneNo2', 'txtPhoneNo3');
    //    });
    //    $("#txtPhoneNo3").keyup(function () {
    //        checkSerialNoMaxLen('txtPhoneNo3', 'txtProblemDescript');
    //    });
    $("#txtPhoneNo1").change(function () {
        isDoubleByte(this);
    });
    $("#txtPhoneNo2").change(function () {
        isDoubleByte(this);
    });
    $("#txtPhoneNo3").change(function () {
        isDoubleByte(this);
    });
    $("#txtProblemDescript").keypress(function () {
        return imposeMaxLength(this, 15000);
    });
    $("#txtUrlDescript").keypress(function () {
        return imposeMaxLength(this, 15000);
    });
    $("#txtGuid").change(function () {
        isDoubleByte(this)
    });
    $("#txtSpnid").change(function () {
        isDoubleByte(this)
    });
    $("#txtEmailUsername").change(function () {
        isDoubleByte(this)
    });
    $("#txtEmailDomain").change(function () {
        isDoubleByte(this)
    });
    $("#txtConEmailUsername").change(function () {
        isDoubleByte(this)
    });
    $("#txtConEmailDomain").change(function () {
        isDoubleByte(this)
    });

    $("#imgBackToStep1").click(function () {
        $(window).scrollTop(0);
        $("#wrapper-inn").tabs("select", 0);
        CoremetricsTracking('1');
        GATracking('1');
        return true;
    });
    $("#imgGoToStep2").click(function () {
        var result = false;
        $("#imgGoToStep2").attr("disabled", true);
        //check uploading is complete
        if (g_isUploading) {
            alert('Please wait uploading complete.');
            $("#imgGoToStep2").attr("disabled", false);
            return false;
        }

        //valiation and submit
        if (ValiationForm() && StoreFormData()) {
            ChangeContentBySRTypeStep2();
            $(window).scrollTop(0);
            $("#wrapper-inn").tabs("select", 1);
            FillStep2Data();
            CoremetricsTracking('2');
            GATracking('2');
            result = true;
        } else {
            result = false;
        }
        $("#imgGoToStep2").attr("disabled", false);
        //$('#imgGoToStep2').bind('click');
        return result;
    });
    $("#imgGoToStep3").click(function () {
        var result = false;
        $("#imgGoToStep3").attr("disabled", true);
        //$('#imgGoToStep3').unbind('click');
        if (SubmitForm()) {
            $(window).scrollTop(0);
            $("#wrapper-inn").tabs("select", 2);
            CoremetricsTracking('3');
            GATracking('3');
            result = true;
        }
        else {
            $(window).scrollTop(0);
            $("#wrapper-inn").tabs("select", 3);
            var title = "<a href=" + "'http://jp.trendmicro.com/jp/support/personal/index.html'" + ">トップ</a> &gt;<a href=" + "'http://jp.trendmicro.com/jp/support/personal/contact/index.html'" + ">お問い合わせ</a>&gt; メールでのお問い合わせ";
            $("#navBarTitle").html(title);
            result = false;
        }
        $("#imgGoToStep3").attr("disabled", false);
        //$('#imgGoToStep3').bind('click');
        return result;
    });
    //#endregion start other control event handler

    init_onReady();
});

//init function
function init_onReady() {
    
    //1.set sessioin(accessID)    
    SetSession();
    //2.changeContentBySRType
    ChangeContentBySRTypeStep1();
    //3.pre-fill field data from seesion 
    GetStep1Data(); 
    //4.detect flash plugin
    if (!detectFlash()) {
        //alert("Please intalled flash player(http://get.adobe.com/flashplayer/) for upload attachment. ")
        $('#noneFlashDiv').show();
        $('#fileUploadDiv').hide();
    }
    else {
        $('#noneFlashDiv').hide();
        $('#fileUploadDiv').show();
    }
    //5.show all tabs
    $("#tabs-1").show();
    $("#tabs-2").show();
    $("#tabs-3").show();
    $("#tabs-4").show();
    //6.init tabs plug
    $("#wrapper-inn").tabs();
    //7.CoremetricsTracking step1
    CoremetricsTracking('1');
}
function SetSession() {
    $.ajax({
        type: "GET",
        url: "../WebService/SessionHandler.ashx",
        cache: false,
        async: false,
        data: { Method: 'SetID' },
        success: function (response) {
            if (response != "Success")
                alert("Set Session System Error");

        },
        error: function (response) {
        },
        complete: function (response) {
        }
    });
}

//activeX
function doUploadifyFailed(errorMsg) {
    $('#fileUploader').uploadifyClearQueue();
    g_isUploading = false;
    alert(errorMsg);
}
function doUploadifySuccess() {
    g_isUploading = false;
}
function ShowLoadImg(id, display) {
    $("#" + id).attr("src", "../image/JPSRF/File-loader.gif");
    $("#" + id).css("display", display);
}
function toggleActivexError(isError, objId) {
    if (isError)
    { $("#" + objId).css("display", ""); }
    else
    { $("#" + objId).css("display", "none"); }
}
function activexBindControls(activexProductionName) {
    var env = CheckUserEnv();
    if (env == "ie") {
        var activex = document.getElementById("VBInfoOcx");
        if (activex.object != null) {
            var inJson = activex.object.GetPCInfo();
            var jsonResult = $.evalJSON(inJson);
            activexSetSerialNumber(jsonResult);
            activexSetProductControls(jsonResult);
        }
    }
}
function activexSetProductControls(jsonResult) {
	$.ajax({
		type: "GET",
		url: "../WebService/ProductActivexHandler.ashx",
		cache: false,
		async: false,
		data: { SRType: g_lblSRTypeValue,
			ProductName: jsonResult.ProductName,
			VBVersion: jsonResult.VBVersion,
			OSVersion: jsonResult.OSVersion,
			SerialNumber: jsonResult.SerialNumber
		},
		success: function (response) {
			if (response != "") {
				var jsonResult = $.evalJSON(response);
				$("#ddlProduct").val(jsonResult.ProductName);
				GetProductVersion(false, jsonResult.ProductName);
				$("#ddlProductVer").val(jsonResult.ProductVer);
				GetProductOS(jsonResult.ProductVer);
				$("#ddlProductOS").val(jsonResult.ProductOS);
			}
		},
		error: function (response) {
		},
		complete: function (response) {

		}
	});
}
function activexSetSerialNumber(jsonResult) {
    if (jsonResult.SerialNumber) {
        var tmp = jsonResult.SerialNumber.split("-");
        if (tmp[0])
            $("#txtSerialNo1").val(tmp[0]);
        if (tmp[1])
            $("#txtSerialNo2").val(tmp[1]);
        if (tmp[2])
            $("#txtSerialNo3").val(tmp[2]);
        if (tmp[3])
            $("#txtSerialNo4").val(tmp[3]);
        if (tmp[4])
            $("#txtSerialNo5").val(tmp[4]);
    }
}
function CheckUserEnv() {
    if ($.client.browser == "Explorer" & $.client.os == "Windows")
        return "ie";
    else
        return "non-ie";
}

//product data bind
function GetProduct(IsAsync) {
    $("#ddlProduct").empty;
    $("#ddlProduct").removeOption(/./);
    $("#ddlProduct").addOption("", g_selectStrProduct);
    ShowLoadImg("imgProductLoading", "");
    $("#ddlProduct").attr("disabled", true);
    $.ajax({
        type: "GET",
        url: "../WebService/ProductHandler.ashx",
        cache: false,
        async: IsAsync,
        success: function (response) {
            if (response != "") {
                var jsonResult = $.evalJSON(response);
                var sorted = jsonResult.sort(SortByValue);
                $.each(sorted, function (index, value) {
                    $("#ddlProduct").addOption(value, value);
                });
                $("#ddlProduct").selectOptions("");
            }
        },
        error: function (response) {
        },
        complete: function (response) {
            ShowLoadImg("imgProductLoading", "none");
            $("#ddlProduct").attr("disabled", false);

        }
    });
}
function GetProductVersion(isAsync, inProductName) {
    $("#ddlProductVer").empty;
    $("#ddlProductVer").removeOption(/./);
    $("#ddlProductVer").addOption("", g_selectStrProductVer);
    $("#ddlProductOS").empty;
    $("#ddlProductOS").removeOption(/./);
    $("#ddlProductOS").addOption("", g_selectStrProductOS);

    if (inProductName != "") {
        $("#ddlProductVer").attr("disabled", true);
        ShowLoadImg("imgProductVersionLoading", "");
        $("#ddlProductOS").attr("disabled", true);
        ShowLoadImg("imgProductOSLoading", "");
        $.ajax({
            type: "GET",
            url: "../WebService/ProductVersionAndOSHandler.ashx",
            cache: false,
            async: isAsync,
            data: ({ productName: inProductName }),
            success: function (response) {
                if (response != "") {
                    g_jsonProductVerAndOS = $.evalJSON(response);
                    $.each(g_jsonProductVerAndOS, function (index, item) {
                        if (!searchSel("ddlProductVer", item.Key))
                            $("#ddlProductVer").addOption(item.Key, item.Key);
                    });                    
                    sortDropDownListByValue("#ddlProductVer");                            
                    $("#ddlProductVer").selectOptions("");
                }
            },
            error: function (response) {

            },
            complete: function (response) {
                GetProductOS($("#ddlProductVer").val());
                ShowLoadImg("imgProductVersionLoading", "none");
                $("#ddlProductVer").attr("disabled", false);
                ShowLoadImg("imgProductOSLoading", "none");
                $("#ddlProductOS").attr("disabled", false);
            }
        });
    }
}
function GetProductOS(inProductVersion) {
    $("#ddlProductOS").empty;
    $("#ddlProductOS").removeOption(/./);
    $("#ddlProductOS").addOption("", g_selectStrProductOS);

    if (inProductVersion != "") {
        $("#ddlProductOS").attr("disabled", true);
        ShowLoadImg("imgProductOSLoading", "");

        if (g_jsonProductVerAndOS) {
            $.each(g_jsonProductVerAndOS, function (index, item) {
                if (inProductVersion == item.Key)
                    $("#ddlProductOS").addOption(item.Value, item.Value);
            });
        }
        $("#ddlProductOS").selectOptions("");
        ShowLoadImg("imgProductOSLoading", "none");
        $("#ddlProductOS").attr("disabled", false);
    }
}

//switch content
function ChangeContentBySRTypeStep1() {
    var rootTitle = "<a href=" + "'http://jp.trendmicro.com/jp/support/personal/vb/index.html'" + ">トップ</a>";
    var level2Title = "<a href=" + "'http://jp.trendmicro.com/jp/support/personal/vb/contact/index.html'" + ">お問い合わせ</a>";
    var step1_CS_Title = "メールでのお問い合わせ（契約更新・登録情報について）";
    var step1_TS_Title = "メールでのお問い合わせ（技術的な内容について）";
    var step1_VE_Title = "メールでのお問い合わせ（ウイルスについて）";
    var title;
    if (getPageType() == "cs") {
        //CreateNavBar
        title = rootTitle + "  >  " + level2Title + "  >  " + step1_CS_Title;
        //SwitchFormField
        $(".veOptField").css("display", "none");
        $(".vetsOptField").css("display", "none");
        //change SR Type
        g_lblSRTypeValue = '契約更新・登録情報について'
        g_lblSRTypeDisplayedText = '契約更新・登録情報について';
        $("#lblSRType").text(g_lblSRTypeDisplayedText);
        $("#formTitle").text('お問い合わせ内容の入力　：　契約更新・登録情報について');
        $(document).attr('title', 'メールでのお問い合わせ (契約更新・登録情報について)');        
    } else if (getPageType() == "ts") {
        //CreateNavBar
        title = rootTitle + "  >  " + level2Title + "  >  " + step1_TS_Title;
        //SwitchFormField
        $(".veOptField").css("display", "none");
        //change SR Type
        g_lblSRTypeValue = '技術的なお問い合わせ'
        g_lblSRTypeDisplayedText = '技術的な内容について';
        $("#lblSRType").text(g_lblSRTypeDisplayedText);
        $("#formTitle").text('お問い合わせ内容の入力　：　技術的な内容について');        
        $(document).attr('title', 'メールでのお問い合わせ (技術的な内容について)');
        $(".spanSPNID").html('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;サポートID（任意）');
        $("#spanSPNIDLink").text('サポートID');        
    } else if (getPageType() == "ve") {
        //CreateNavBar
        title = rootTitle + "  >  " + level2Title + "  >  " + step1_VE_Title;
        //change SR Type
        g_lblSRTypeValue = 'ウイルスについて'
        g_lblSRTypeDisplayedText = 'ウイルスについて';
        $("#lblSRType").text(g_lblSRTypeDisplayedText);
        $("#formTitle").text('お問い合わせ内容の入力　：　ウイルスについて');        
        $(document).attr('title', 'メールでのお問い合わせ (ウイルスについて)');
        $(".spanSPNID").html('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;スマートプロテクション<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;ネットワークID（任意）<br />');
        $("#spanSPNIDLink").html('スマートプロテクションネットワークID');        
    } else {
        title = rootTitle + "  >  " + level2Title + "  >  " + step1_VE_Title;
        //change SR Type
        g_lblSRTypeValue = 'ウイルスについて'
        g_lblSRTypeDisplayedText = 'ウイルスについて';
        $("#lblSRType").text(g_lblSRTypeDisplayedText);
        $("#formTitle").text('ウイルスについて');        
    }
    $("#navBarTitle").html(title);
}
function ChangeContentBySRTypeStep2() {

    if (getPageType() == "cs") {

        //SwitchFormField
        $(".veOptField").css("display", "none");
        $(".vetsOptField").css("display", "none");


    } else if (getPageType() == "ts") {

        //SwitchFormField
        $(".veOptField").css("display", "none");


    } else if (getPageType() == "ve") {


    }
}
function getPageType() {
    if (location.pathname.search("srf-cs-step1.aspx") != -1) {
        return "cs";
    } else if (location.pathname.search("srf-ts-step1.aspx") != -1) {
        return "ts";
    } else if (location.pathname.search("srf-ve-step1.aspx") != -1) {
        return "ve";
    }
}
//validator
function isDoubleByte(objTemp) {
    objTemp.value = objTemp.value.replace(/[\u0100-\uffff]/g, "");
}
function isHalfByte(objTemp) {
    //objTemp.value = objTemp.value.replace(/[\u0000-\u00ff]/g, "");
}
function checkSerialNumberIsFillIn() {
    if (trim($("#txtSerialNo1").val()) == '' ||
	            trim($("#txtSerialNo2").val()) == '' ||
	            trim($("#txtSerialNo3").val()) == '' ||
	            trim($("#txtSerialNo4").val()) == '' ||
	            trim($("#txtSerialNo5").val()) == '') {
        //donothing
    }
    else {
        toggleActivexError(false, 'imgSrActivexError')
    }
}
function checkSerialNoMaxLen(currentcontrol, nextcontrol) {
    var cctrl = document.getElementById(currentcontrol);
    var ln = cctrl.value.length;
    if (ln >= 4) document.getElementById(nextcontrol).focus();
}
function IsGUID(inString) {
    var guidRegEx = /^(\{{0,1}([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){12}\}{0,1})$/;
    if (guidRegEx.test(inString))
        return true;
    else
        return false;
}
function chkPattern(strString) {
    var strValidChars = "0123456789.";
    var strChar;
    var blnResult = true;

    for (var i = 0; i < strString.length; i++) {
        strChar = strString.charAt(i);
        if (strValidChars.indexOf(strChar) == -1) {
            blnResult = false;
        }
    }
    return blnResult;
}
function snValidatorChangeStyle(vaild, errorMessage) {
    if (vaild) {
        $('#txtSerialNo1').removeClass("error");
        $('#txtSerialNo2').removeClass("error");
        $('#txtSerialNo3').removeClass("error");
        $('#txtSerialNo4').removeClass("error");
        $('#txtSerialNo5').removeClass("error");
        $('#divSrErrorMessage').removeClass("validateError");
        $('#divSrErrorMessage').html('');
        $('#divSrErrorMessage').hide();
    }
    else {
        $('#txtSerialNo1').addClass("error");
        $('#txtSerialNo2').addClass("error");
        $('#txtSerialNo3').addClass("error");
        $('#txtSerialNo4').addClass("error");
        $('#txtSerialNo5').addClass("error");
        $('#divSrErrorMessage').addClass("validateError");
        $('#divSrErrorMessage').html(errorMessage);
        $('#divSrErrorMessage').show();
    }
}


function ValiationForm() {
    var vForm = $("#form1").validate({
        onkeyup: false,
        onblur: false,
        onclick: false,
        onfocusout: false,
        focusInvalid: false,
        focusOutCheck: false,
        errorClass: "validateError",
        errorPlacement: function (error, element) {
            error.appendTo(element.parent());
        }
    });
    var obj;
    $("#tabs-1").find(".g1").each(function () {
        if (vForm.element("#" + this.id) == false) {
            if (obj == undefined)
                obj = this;
        }
    });
    if (obj == undefined) {
        return true;
    }
    else {
        $('#' + obj.id).focus();
        return false;
    }
}

//post & store data on web server
function StoreFormData() {
    var v_obj_form = new GetFormObj();
    var result = false;
    $.ajax({
        url: '../WebService/SubmitHandler.ashx',
        type: 'POST',
        cache: false,
        async: false,
        data: { FormInfoJSON: encodeURIComponent($.toJSON(v_obj_form)), Method: 'Store' },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("System Error! Please try it later.");
            return false;
        },
        success: function (response) {
            if (response == "Success") {
                result = true;
            }
            else {
                alert("System Error! Please try it later.");
                result = false;
            }
        },
        complete: function (response) {

        }
    });
    return result;
}
function SubmitForm() {
    var result
    var v_obj_form = new GetFormObj();
    $.ajax({
        url: '../WebService/SubmitHandler.ashx',
        type: 'POST',
        cache: false,
        async: false,
        data: { Method: 'Submit' },
        error: function (xhr, ajaxOptions, thrownError) {
            //alert("System Error! Please try it later.");
            result = false;
        },
        success: function (response) {
            if (response == "Success") {
                result = true;
            }
            else {
                //alert("System Error! Please try it later.");
                result = false;
            }
        },
        complete: function (response) {
        }
    });
    return result;
}
function GetFormObj() {
    this.SerialNumber = $("#txtSerialNo1").val() + "-" + $("#txtSerialNo2").val() + "-" + $("#txtSerialNo3").val() + "-" + $("#txtSerialNo4").val() + "-" + $("#txtSerialNo5").val();
    this.ProductName = $("#ddlProduct").val();
    this.ProductVersion = $("#ddlProductVer").val();
    this.OS = $("#ddlProductOS").val();
    this.FirstName = $("#txtFirstName").val();
    this.LastName = $("#txtLastName").val();    
    this.Email = $("#txtEmailUsername").val() + "@" + $("#txtEmailDomain").val();
    this.ContactNumber = $("#txtPhoneNo1").val() + "-" + $("#txtPhoneNo2").val() + "-" + $("#txtPhoneNo3").val();
    this.Description = $("#txtProblemDescript").val();
    this.PatternNumber = $("#txtPatternNum").val();
    this.MalwareName = $("#txtVirusName").val();
    this.DetectedLocation = $("#txtUrlDescript").val();
    this.GUID = $("#txtGuid").val();
    this.SPNID = $("#txtSpnid").val();
    this.AttachmentFilePath = $("#hidUploadFilePath").val();
    this.AttachmentOriginalFileName = $("#hidOriginFileName").val(); //2012/2/7 add for RTL
    this.SRType = g_lblSRTypeValue;
    if (getPageType() == "ve") {
        if ($("#chkMultipleLayer").attr("checked") == true)
            this.MultipleLayerForAttachment = true;
        else
            this.MultipleLayerForAttachment = false;
    }
}
function FillStep1Data(inJson) {
    var tmp = '';
    if (inJson.SerialNumber) {
        tmp = inJson.SerialNumber.split("-");
        if (tmp[0])
            $("#txtSerialNo1").val(tmp[0]);
        if (tmp[1])
            $("#txtSerialNo2").val(tmp[1]);
        if (tmp[2])
            $("#txtSerialNo3").val(tmp[2]);
        if (tmp[3])
            $("#txtSerialNo4").val(tmp[3]);
        if (tmp[4])
            $("#txtSerialNo5").val(tmp[4]);
    }
    if (inJson.ProductName && inJson.ProductVersion && inJson.OS) {
        GetProduct(false);
        setSelOpt('ddlProduct', inJson.ProductName);

        GetProductVersion(false, inJson.ProductName);
        setSelOpt('ddlProductVer', inJson.ProductVersion);

        GetProductOS(inJson.ProductVersion);
        setSelOpt('ddlProductOS', inJson.OS);
    }
    $("#txtFirstName").val(inJson.FirstName);
    $("#txtLastName").val(inJson.LastName);


    $("#txtEmailUsername").val(inJson.Email.split("@")[0]);
    $("#txtEmailDomain").val(inJson.Email.split("@")[1]);

    if (inJson.ContactNumber) {
        tmp = inJson.SerialNumber.split("-");
        if (tmp[0])
            $("#txtPhoneNo1").val(tmp[4]);
        if (tmp[1])
            $("#txtPhoneNo2").val(tmp[4]);
        if (tmp[2])
            $("#txtPhoneNo3").val(tmp[4]);
    }
    $("#txtProblemDescript").val(inJson.Description);
    $("#txtPatternNum").val(inJson.PatternNumber);
    $("#txtVirusName").val(inJson.MalwareName);
    $("#txtUrlDescript").val(inJson.DetectedLocation);
    $("#txtGuid").val(inJson.GUID);
    $("#txtSpnid").val(inJson.SPNID);
    if (getPageType() == "ve") {
        if (inJosn.MultipleLayerForAttachment)
            $("#chkMultipleLayer").attr("checked", "true");
        else
            $("#chkMultipleLayer").attr("checked", "");
    }
}
function FillStep2Data() {
    $("#step2_lblSerialNo").text(
	            $("#txtSerialNo1").val() + "-" + $("#txtSerialNo2").val() + "-" + $("#txtSerialNo3").val() + "-" + $("#txtSerialNo4").val() + "-" + $("#txtSerialNo5").val()
	        );
    $("#step2_lblProduct").text($("#ddlProduct").val());
    $("#step2_lblProductVer").text($("#ddlProductVer").val());
    $("#step2_lblProductOS").text($("#ddlProductOS").val());
    $("#step2_lblSRType").text(g_lblSRTypeDisplayedText);
    //$("#step2_lblFullName").html($("#txtLastName").val() + "&nbsp;" + $("#txtFirstName").val());
    $("#step2_lblFullName").text($("#txtLastName").val() + " " + $("#txtFirstName").val());
    $("#step2_lblEmail").text($("#txtEmailUsername").val() + "@" + $("#txtEmailDomain").val());
    $("#step2_lblPhoneNo").text($("#txtPhoneNo1").val() + "-" + $("#txtPhoneNo2").val() + "-" + $("#txtPhoneNo3").val());
    //$("#step2_lblHowSearchVirus").text('HowSearchVirus'); //todo:unknow
    //$("#step2_lblPCAndSE_PCAndSTDP").text('PCAndSE_PCAndSTDP'); //todo:unknow
    //$("#step2_lblProblemDescript").html($("#txtProblemDescript").val().replace(/[\r\n]/g, "<br/>").replace(/   /g, "&nbsp;"));
    $("#step2_lblProblemDescript").html(htmlEncodeWithBR($("#txtProblemDescript").val()));
    $("#step2_lblPatternNum").text($("#txtPatternNum").val());
    $("#step2_lblVirusName").text($("#txtVirusName").val());
    //$("#step2_lblUrlDescript").html($("#txtUrlDescript").val().replace(/[\r\n]/g, "<br/>").replace(/   /g, "&nbsp;"));
    $("#step2_lblUrlDescript").html(htmlEncodeWithBR($("#txtUrlDescript").val()));
    $("#step2_lblProductGuid").text($("#txtGuid").val());
    $("#step2_lblSpnid").text($("#txtSpnid").val());
    $("#step2_lblOriginFileName").text($("#hidOriginFileName").val());
}
function GetStep1Data() {
    $.ajax({
        type: "GET",
        url: "../WebService/SessionHandler.ashx",
        cache: false,
        async: false,
        data: { Method: 'GetFormData' },
        success: function (response) {
            if (response != "") {
                var jsonResult = $.evalJSON(response);
                FillStep1Data(jsonResult);
            }
            else {
                GetProduct(false);
            }
        },
        error: function (response) {
        },
        complete: function (response) {
        }
    });
}

//common method
function QueryString(name) {
    var AllVars = window.location.search.substring(1);
    var Vars = AllVars.split("&");
    for (var i = 0; i < Vars.length; i++) {
        var Var = Vars[i].split("=");
        if (Var[0] == name) return Var[1];
    }
    return "";
}
function trim(str) {
    var str = str.replace(/^\s\s*/, ''), ws = /\s/, i = str.length;
    while (ws.test(str.charAt(--i)));
    return str.slice(0, i + 1);
}
function popUp(URL, w, h) {
    var day = new Date();
    var id = day.getTime();
    var winl = (screen.width / 2) - (w / 2);
    var wint = (screen.height / 2) - (h / 2);
    eval("page" + id + " = window.open(URL, '" + id + "', 'toolbar=0,scrollbars=0,location=0,statusbar=0,menubar=0,resizable=0,width=" + w + ",height=" + h + ",left=" + winl + ",top=" + wint + "');");
}
function searchSel(objId, keyword) {
    var options = document.getElementById(objId).options;
    for (var i = 0; i < options.length; i++) {
        if (options[i].value == keyword) {
            return true;
        }
    }
    return false;
}
function setSelOpt(objId, keyword) {
    var options = document.getElementById(objId).options;
    for (var i = 0; i < options.length; i++) {
        if (options[i].value == keyword) {
            options[i].selected = true;
            return;
        }
    }
}
function imposeMaxLength(Object, MaxLen) {
    return (Object.value.length <= MaxLen);
}
function ToUpperCase(text) {
    text.value = text.value.toUpperCase();
}
function SortOptions(id) {
    var prePrepend = "#";
    if (id.match("^#") == "#") prePrepend = "";
    $(prePrepend + id).html($(prePrepend + id + " option").sort(
	        function (a, b) { return a.text == b.text ? 0 : a.text < b.text ? -1 : 1 })
	    );
}
function SortByValue(x, y) {
    return ((x == y) ? 0 : ((x > y) ? 1 : -1));
}
function closeWin() {
    if (g_newWindow != null) {
        if (!g_newWindow.closed)
            g_newWindow.close();
    }
}
function popUpWin(url, type, strWidth, strHeight) {
    closeWin();
    if (type == "fullScreen") {
        strWidth = screen.availWidth - 10;
        strHeight = screen.availHeight - 160;
    }
    var tools = "";
    if (type == "standard" || type == "fullScreen") tools = "resizable,toolbar=yes,location=yes,scrollbars=yes ,menubar=yes,width=" + strWidth + ",height=" + strHeight + ",top=0,left=0";
    if (type == "console") tools = "resizable,toolbar=no,location=no,scrollbars=no,width=" + strWidth + ",height=" + strHeight + ",left=0,top=0 ";
    g_newWindow = window.open(url, 'newWin', tools);
    g_newWindow.focus();
}
function detectFlash() {
    var playerVersion = swfobject.getFlashPlayerVersion(); // returns a JavaScript object
    if (playerVersion.major == "8" || playerVersion.major == "7" || playerVersion.major == "6"
        || playerVersion.major == "5" || playerVersion.major == "4" || playerVersion.major == "3"
        || playerVersion.major == "2" || playerVersion.major == "1" || playerVersion.major == "0")
        return false;   //bigger than 9.0 for uploadify
    else
        return true;
}
function sortDropDownListByValue(selectId) {
    $(selectId).html($(selectId + " option").sort(function (a, b) {
        return a.value == b.value ? 0 : a.value < b.value ? -1 : 1
    }))
}
function htmlEncodeWithBR(value) {
    //create a in-memory div, set it's inner text(which jQuery automatically encodes)
    //then grab the encoded contents back out.  The div never exists on the page.
    return $('<div/>').text(value).html().replace(/[\r\n]/g, "<br/>").replace(/   /g, "&nbsp;");
}