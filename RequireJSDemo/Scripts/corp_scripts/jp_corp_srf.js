var g_segment = "corporate";
//ajax
var g_isAsync = true;
//selectStr
var g_selectStrProduct = "-  選択してください  -";
var g_selectStrProductVer = "-  選択してください  -";
var g_selectStrProductOS = "-  選択してください  -";
//dropdownlist
var g_jsonProductVerAndOS;
var g_systemErrMsg = "一時的なネットワークのエラーです。\n少し時間を置き、再度お試しください。\n";

jQuery(document).ready(function () {
    
    //setUnloadWarning(true); //(it will disply when cancel flash upload)

    SetUploadObject();

    GetProduct();
    GetProductVersion("");
    GetCorpSRFLinks("All", "");

    $("#ddlProduct").change(function () {
        $("#ddlProduct2").selectOptions($(this).val());
        GetProductVersion($(this).val());
    });

    $("#ddlProduct2").change(function () {
        $("#ddlProduct").selectOptions($(this).val());
        GetProductVersion($(this).val());
    });

    $("#ddlProductVer").change(function () {
        $("#ddlProductVer2").selectOptions($(this).val());
        GetProductOS($(this).val());
    });

    $("#ddlProductVer2").change(function () {
        $("#ddlProductVer").selectOptions($(this).val());
        GetProductOS($(this).val());
    });

    $("#imgbtnGo").click(function () {
        if ($("#pnlSolution").css("display") == "none") {
            if (ValidateStep1()) {
                $("#ddlProduct").attr("disabled", true);
                $("#ddlProductVer").attr("disabled", true);
                $("#imgbtnGo").attr("src", "../image/corp_images/btnGoInActive.gif");
                $("#pnlSolution").css("display", "");
                //getFAQsbyProduct
                GetCorpSRFLinks("Faq", $("#ddlProduct").val());
                //getUpdateCenterbyProduct
                GetCorpSRFLinks("Update", $("#ddlProduct").val());
            }
        }
        else {
            $("#ddlProduct").attr("disabled", false);
            $("#ddlProductVer").attr("disabled", false);
            $("#imgbtnGo").attr("src", "../image/corp_images/btnGoActive.gif");
            $("#pnlSolution").css("display", "none");
        }
    });

    $("#btnGoToStep2").click(function () {
        $("#divStep1").css("display", "none");
        $("#divStep2").css("display", "");
        GaAndCoremetricsTracking("2");
    });

    $("#btnGoToStep3").click(function () {
        if (ValidateStep2()) {
            GoToStep3();
        }
    });

    $("#linkBackStep2").click(function () {
        BackToStep2();
        $("#txtSerialNo").focus();
    });

    $("#btnBackToStep3").click(function () {
        BackToStep3();
        return false;
    });

    $("#btnAgreementBack").click(function () {
        BackToStep2();
        $("#srfAgree").focus();
        return false;
    });

    $("#imgbtnBackVirus").click(function () {
        BackToStep2();
        return false;
    });

    $("#imgbtnBackProd").click(function () {
        BackToStep2();
        return false;
    });

    $("#imgbtnSubmitProd").click(function () {
        if (ValidateStep3_Products()) {
            GoToStep4();
        }
        return false;
    });

    $("#imgbtnSubmitVirus").click(function () {
        if (ValidateStep3_Virus()) {
            GoToStep4();
        }
        return false;
    });

    $("#btnSubmitSRF").click(function () {
        SubmitForm();
        return false;
    });

    $("#imgProductUploadCancel").click(function () {
        $("#imgProductUploadCancel").hide();
        $("#lblProductUploadFileName").html("");
        UploadCancel();
    });

    $("#imgVirusUploadCancel").click(function () {
        $("#imgVirusUploadCancel").hide();
        $("#lblVirusUploadFileName").html("");
        UploadCancel();
    });

    //Virus Description Word
    if ($('#hid_Corp_Cons_MalwareAtt_None_Zip').val() == 'y') {
        $(".classRTL").show();
        $(".classBeforeRTL").hide();
    }
    else {
        $(".classRTL").hide();
        $(".classBeforeRTL").show();
    }

});

//alert when unload page
function setUnloadWarning(enabled) {
    window.onbeforeunload =
                    enabled ? showWarning : null;
}
function showWarning() {
    return ""
}

function OpenDialog(pageType) {    
    $("#dialog").dialog({ modal: true });
    $('#uploadForm').attr("action", "../WebService/UploadWebSrc.ashx?queryString=sharefolder&pageType=" + pageType);    
}

function UploadCancel() {    
    $("#hidProductUploadFilePath").val('');
    $("#hidProductOriginFileName").val('');
    $("#imgbtnSubmitProd").attr("disabled", false);
    ShowLoadImg("imgProductUploadFileLoading", "none");

    $("#hidVirusUploadFilePath").val('');
    $("#hidVirusOriginFileName").val('');
    $("#imgbtnSubmitVirus").attr("disabled", false);
    ShowLoadImg("imgVirusUploadFileLoading", "none");
}

function SetUploadObject() {
//no need to show checkbox
//    if ($('#hid_Corp_Cons_MalwareAtt_None_Zip').val() == 'y')
//        $("#divMultipleCompression").show();

    if (!detectFlash()) {
        $('#noneFlashDiv1').show();
        $('#noneFlashDiv2').show();
        $('#flashDiv1').hide();
        $('#flashDiv2').hide();

        $('#uploadForm').ajaxForm({
            beforeSubmit: function (arr, $form, options) {
                if ($("#fileUploaded").val() == '') {
                    alert('ファイルを選択して下さい');                    
                    return false;
                }
                else {
                    if ($('#uploadForm').attr("action").search("Products") != -1) {
                        $("#imgbtnSubmitProd").attr("disabled", true);
                        $("#btnProductUpload").attr("disabled", true);
                        ShowLoadImg("imgProductUploadFileLoading", "");
                    }
                    else {
                        //no need to check this
                        //                        if ($('#hid_Corp_Cons_MalwareAtt_None_Zip').val() == 'y') {
                        //                            var fileType = $("#fileUploaded").val().split('\\').pop().split('.').pop();
                        //                            if (!(fileType.toLowerCase() == 'zip' || fileType.toLowerCase() == 'rar')) {
                        //                                alert('.zip　か　.rar　ファイルを選択し、アップロードしてください');
                        //                                return false;
                        //                            }
                        //                        }

                        $("#imgbtnSubmitVirus").attr("disabled", true);
                        $("#btnVirusUpload").attr("disabled", true);
                        ShowLoadImg("imgVirusUploadFileLoading", "");
                    }
                    ShowLoadImg("imgFormUploadFileLoading", "");
                    $("#btnUploadSubmit").hide();
                }
            },
            success: function (response) {

                response = response.replace(/(<.*?>)/ig, ""); //remove html tag;

                if (response.search("result=failed") != -1) {
                    if (response.search(",") != -1) {
                        var errMsg = response.split(',')[1];
                        if (errMsg.search("size") != -1)
                            alert('アップロードファイルのサイズは50MB以下にしてください。');
                        else
                            alert(g_systemErrMsg + "(Form Upload Failed Split)");
                    }
                    else {
                        alert(g_systemErrMsg + "(Form Upload Failed)");
                    }
                    return;
                }
                else if (response.search("result=success") != -1) {
                    var fileName = $("#fileUploaded").val().split('\\').pop();
                    var filePath = response.split(',')[1].replace('filepath=', '');
                    if ($('#uploadForm').attr("action").search("Products") != -1) {
                        $("#hidProductUploadFilePath").val(filePath);
                        $("#hidProductOriginFileName").val(fileName);
                        $("#lblProductUploadFileName").html(fileName);
                        $("#imgProductUploadCancel").show();
                    }
                    else {
                        $("#hidVirusUploadFilePath").val(filePath);
                        $("#hidVirusOriginFileName").val(fileName);
                        $("#lblVirusUploadFileName").html(fileName);
                        $("#imgVirusUploadCancel").show();
                    }
                    alert(fileName + " ファイルを添付しました。");
                    return;
                }
                else {
                    alert(g_systemErrMsg + "(Form Upload Unknow)");
                    return;
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(g_systemErrMsg + "(Form Upload:" + textStatus + ")");
            },
            complete: function (jqXHR, textStatus) {
                if ($('#uploadForm').attr("action").search("Products") != -1) {
                    $("#imgbtnSubmitProd").attr("disabled", false);
                    $("#btnProductUpload").attr("disabled", false);
                    ShowLoadImg("imgProductUploadFileLoading", "none");
                }
                else {
                    $("#imgbtnSubmitVirus").attr("disabled", false);
                    $("#btnVirusUpload").attr("disabled", false);
                    ShowLoadImg("imgVirusUploadFileLoading", "none");
                }
                $("#fileUploaded").replaceWith("<input id='fileUploaded' name='Filedata' type='file' />");
                $("#dialog").dialog("close");
                ShowLoadImg("imgFormUploadFileLoading", "none");
                $("#btnUploadSubmit").show();
            }
        });

    } else {
        $('#noneFlashDiv1').hide();
        $('#noneFlashDiv2').hide();

        //uploader
        $('#productFileUploader').uploadify({
            'uploader': '../Scripts/uploadify/uploadify.swf',
            'script': '../WebService/UploadWebSrc.ashx?queryString=sharefolder%26pageType=Products',
            'auto': true,
            'queueID': 'productUploadQueue',
            'queueSizeLimit': 1,
            'simUploadLimit': 1,
            'removeCompleted': false,
            'sizeLimit': 51200000,
            // Button settings
            'cancelImg': '../Scripts/uploadify/cancel.png',
            'buttonImg': '../image/JPSRF/button_upload.gif',
            'width': 175,
            'height': 40,
            'completedString': '',
            'onSelect': function (event, ID, fileObj) {
                $("#imgbtnSubmitProd").attr("disabled", true);
                ShowLoadImg("imgProductUploadFileLoading", "");
            },
            'onComplete': function (event, ID, fileObj, response, data) {

                $("#imgbtnSubmitProd").attr("disabled", false);
                ShowLoadImg("imgProductUploadFileLoading", "none");

                if (response.search("result=failed") != -1) {
                    alert(g_systemErrMsg + "(Flash Upload Failed)");
                    return;
                }
                else if (response.search("result=success") != -1) {
                    $(".uploadifyQueueItem .fileName").html(fileObj.name);
                    $("#hidProductUploadFilePath").val(response.split(',')[1].replace('filepath=', ''));
                    $("#hidProductOriginFileName").val(fileObj.name);
                    return;
                }
                else {
                    alert(g_systemErrMsg + "(Flash Upload Unknow)");
                    return;
                }
            },
            'onProgress': function (event, ID, fileObj, data) {
                return;
            },
            'onError': function (event, ID, fileObj, errorObj) {

                $("#imgbtnSubmitProd").attr("disabled", false);
                ShowLoadImg("imgProductUploadFileLoading", "none");

                if (errorObj.type === "File Size")
                    alert('アップロードファイルのサイズは50MB以下にしてください。');
                else
                    alert(g_systemErrMsg + "(Flash Upload:" + errorObj.type + ' Error: ' + errorObj.info + ")");
                return;
            },
            'onCancel': function (event, ID, fileObj, data) {
                UploadCancel()
                return;
            }
        });

//        if ($('#hid_Corp_Cons_MalwareAtt_None_Zip').val() == 'y') {
//            $('#virusFileUploader').uploadify({
//                'uploader': '../Scripts/uploadify/uploadify.swf',
//                'script': '../WebService/UploadWebSrc.ashx?queryString=sharefolder%26pageType=Virus',
//                'auto': true,
//                'queueID': 'virusUploadQueue',
//                'queueSizeLimit': 1,
//                'simUploadLimit': 1,
//                'removeCompleted': false,
//                'sizeLimit': 51200000,
//                // Button settings
//                'cancelImg': '../Scripts/uploadify/cancel.png',
//                'buttonImg': '../image/JPSRF/button_upload.gif',
//                'width': 155,
//                'height': 33,
//                'completedString': '',
//                'fileExt': '*.zip;*.rar',
//                'fileDesc': 'ZIP/RAR File',
//                'onSelect': function (event, ID, fileObj) {
//                    if (!(fileObj.type.toLowerCase() == '.zip' || fileObj.type.toLowerCase() == '.rar')) {
//                        alert('.zip　か　.rar　ファイルを選択し、アップロードしてください');
//                        return false;
//                    }
//                    $("#imgbtnSubmitVirus").attr("disabled", true);
//                    ShowLoadImg("imgVirusUploadFileLoading", "");
//                },
//                'onComplete': function (event, ID, fileObj, response, data) {

//                    $("#imgbtnSubmitVirus").attr("disabled", false);
//                    ShowLoadImg("imgVirusUploadFileLoading", "none");

//                    if (response.search("result=failed") != -1) {
//                        alert('upload failed,Please try again!');
//                        return;
//                    }
//                    else if (response.search("result=success") != -1) {
//                        $(".uploadifyQueueItem .fileName").html(fileObj.name);
//                        $("#hidVirusUploadFilePath").val(response.split(',')[1].replace('filepath=', ''));
//                        $("#hidVirusOriginFileName").val(fileObj.name);
//                        return;
//                    }
//                    else {
//                        alert("unknow error,Please try again!");
//                        return;
//                    }
//                },
//                'onProgress': function (event, ID, fileObj, data) {
//                    return;
//                },
//                'onError': function (event, ID, fileObj, errorObj) {
//                    $("#imgbtnSubmitVirus").attr("disabled", false);
//                    ShowLoadImg("imgVirusUploadFileLoading", "none");

//                    if (errorObj.type === "File Size")
//                        alert('アップロードファイルのサイズは50MB以下にしてください。');
//                    else
//                        alert(errorObj.type + ' Error: ' + errorObj.info + " ,Please try again!");
//                    return;
//                },
//                'onCancel': function (event, ID, fileObj, data) {
//                    UploadCancel();
//                    return;
//                }
//            });
//        }
//        else {
        $('#virusFileUploader').uploadify({
            'uploader': '../Scripts/uploadify/uploadify.swf',
            'script': '../WebService/UploadWebSrc.ashx?queryString=sharefolder%26pageType=Virus',
            'auto': true,
            'queueID': 'virusUploadQueue',
            'queueSizeLimit': 1,
            'simUploadLimit': 1,
            'removeCompleted': false,
            'sizeLimit': 51200000,
            // Button settings
            'cancelImg': '../Scripts/uploadify/cancel.png',
            'buttonImg': '../image/JPSRF/button_upload.gif',
            'width': 155,
            'height': 33,
            'completedString': '',
            'onSelect': function (event, ID, fileObj) {
                $("#imgbtnSubmitVirus").attr("disabled", true);
                ShowLoadImg("imgVirusUploadFileLoading", "");
            },
            'onComplete': function (event, ID, fileObj, response, data) {

                $("#imgbtnSubmitVirus").attr("disabled", false);
                ShowLoadImg("imgVirusUploadFileLoading", "none");

                if (response.search("result=failed") != -1) {
                    alert(g_systemErrMsg + "(Flash Upload Failed)");
                    return;
                }
                else if (response.search("result=success") != -1) {
                    $(".uploadifyQueueItem .fileName").html(fileObj.name);
                    $("#hidVirusUploadFilePath").val(response.split(',')[1].replace('filepath=', ''));
                    $("#hidVirusOriginFileName").val(fileObj.name);
                    return;
                }
                else {
                    alert(g_systemErrMsg + "(Flash Upload Unknow)");
                    return;
                }
            },
            'onProgress': function (event, ID, fileObj, data) {
                return;
            },
            'onError': function (event, ID, fileObj, errorObj) {
                $("#imgbtnSubmitVirus").attr("disabled", false);
                ShowLoadImg("imgVirusUploadFileLoading", "none");

                if (errorObj.type === "File Size")
                    alert('アップロードファイルのサイズは50MB以下にしてください。');
                else {
                    alert(g_systemErrMsg + "(Flash Upload:" + errorObj.type + ' Error: ' + errorObj.info + ")");                    
                }
                return;
            },
            'onCancel': function (event, ID, fileObj, data) {
                UploadCancel();
                return;
            }
        });
        //}
    }
}

function doUploadifyFailed(errorMsg) {
    $('#productFileUploader').uploadifyClearQueue();
    $('#virusFileUploader').uploadifyClearQueue();
    g_isUploading = false;
    alert(errorMsg);
}

function BackToStep2() {
    $("#divStep2").css("display", "");
    $("#divStep3").css("display", "none");
    $("#divProduct").css("display", "none");
    $("#divVirus").css("display", "none");
    $("#divError").css("display", "none");
    $("#divAgreement").css("display", "none");
    $(window).scrollTop(0);
    GaAndCoremetricsTracking("2");
}

function BackToStep3() {
    $("#divStep3").css("display", "");
    $("#divStep4").css("display", "none");
    $(window).scrollTop(0);
    GaAndCoremetricsTracking("3");
}

function GetCorpSRFLinks(section, product) {

    if (section == "All") {
        $("#ulAll").empty();
        ShowLoadImg("imgULAllLoading", "");
    }
    else if (section == "Faq") {
        $("#pnlFaq").css("display", "none");
        $("#ulFaq").empty();
        $("#lblFAQProductTitle").empty();
        ShowLoadImg("imgUlFaqLoading", "");
    }
    else if (section == "Update") {
        $("#pnlUpdate").css("display", "none");
        $("#ulUpdate").empty();
        ShowLoadImg("imgUlUpdateLoading", "");
    }

    $.ajax({
        type: "GET",
        url: "../WebService/SRFLinksHandler.ashx",
        cache: false,
        async: g_isAsync,
        data: ({ sectionName: section, productName: product }),
        success: function (response) {
            if (response != "") {
                var jsonResult = $.evalJSON(response);
                var sorted = jsonResult.sort(SortByValue);
                if (section == "All") {
                    $.each(sorted, function (index, value) {
                        $("#ulAll").append("<li class='li_gray'><a target='_blank' href='" + value.Value + "'>" + value.Key + "</a></li>");
                    });
                }
                else if (section == "Faq") {
                    if (jsonResult.length > 0) {
                        $("#pnlFaq").css("display", "");
                        $("#lblFAQProductTitle").html(product);
                        $.each(sorted, function (index, value) {
                            $("#ulFaq").append("<li class='li_gray'><a target='_blank' href='" + value.Value + "'>" + value.Key + "</a></li>");
                        });
                    }
                }
                else if (section == "Update") {
                    if (jsonResult.length > 0) {
                        $("#pnlUpdate").css("display", "");
                        $.each(sorted, function (index, value) {
                            $("#ulUpdate").append("<li class='li_gray'><a target='_blank' href='" + value.Value + "'>" + value.Key + "</a></li>");
                        });
                    }
                }
            }
        },
        error: function (response) {
            alert(g_systemErrMsg + "(SRFLinks)");
        },
        complete: function (response) {
            if (section == "All") {
                ShowLoadImg("imgULAllLoading", "none");
            }
            else if (section == "Faq") {
                ShowLoadImg("imgUlFaqLoading", "none");
            }
            else if (section == "Update") {
                ShowLoadImg("imgUlUpdateLoading", "none");
            }
        }
    });
}

function GetProduct() {
    $("#ddlProduct").empty;
    $("#ddlProduct").removeOption(/./);
    $("#ddlProduct").addOption("", g_selectStrProduct);
    ShowLoadImg("imgProductLoading", "");
    $("#ddlProduct").attr("disabled", true);
    //
    $("#ddlProduct2").empty;
    $("#ddlProduct2").removeOption(/./);
    $("#ddlProduct2").addOption("", g_selectStrProduct);
    ShowLoadImg("imgProductLoading2", "");
    $("#ddlProduct2").attr("disabled", true);
    //
    $.ajax({
        type: "GET",
        url: "../WebService/ProductHandler.ashx",
        cache: false,
        async: g_isAsync,
        data: ({ segment: g_segment }),
        success: function (response) {
            if (response != "") {
                var jsonResult = $.evalJSON(response);
                var sorted = jsonResult.sort(SortByValue);
                $.each(sorted, function (index, value) {
                    $("#ddlProduct").addOption(value, value);
                    $("#ddlProduct2").addOption(value, value);
                });
                $("#ddlProduct").selectOptions("");
                $("#ddlProduct2").selectOptions("");
            }
        },
        error: function (response) {
            alert(g_systemErrMsg + "(Product)");
        },
        complete: function (response) {
            ShowLoadImg("imgProductLoading", "none");
            $("#ddlProduct").attr("disabled", false);
            //
            ShowLoadImg("imgProductLoading2", "none");
            $("#ddlProduct2").attr("disabled", false);
        }
    });
}

function GetProductVersion(inProductName) {
    $("#ddlProductVer").empty;
    $("#ddlProductVer").removeOption(/./);
    $("#ddlProductVer").addOption("", g_selectStrProductVer);
    //
    $("#ddlProductVer2").empty;
    $("#ddlProductVer2").removeOption(/./);
    $("#ddlProductVer2").addOption("", g_selectStrProductVer);
    //
    $("#ddlProductOS2").empty;
    $("#ddlProductOS2").removeOption(/./);
    $("#ddlProductOS2").addOption("", g_selectStrProductOS);

    if (inProductName != "") {
        $("#ddlProductVer").attr("disabled", true);
        ShowLoadImg("imgProductVersionLoading", "");
        //
        $("#ddlProductVer2").attr("disabled", true);
        ShowLoadImg("imgProductVersionLoading2", "");
        $.ajax({
            type: "GET",
            url: "../WebService/ProductVersionAndOSHandler.ashx",
            cache: false,
            async: g_isAsync,
            data: ({ segment: g_segment, productName: inProductName }),
            success: function (response) {
                if (response != "") {
                    g_jsonProductVerAndOS = $.evalJSON(response);
                    $.each(g_jsonProductVerAndOS, function (index, item) {
                        if (!searchSel("ddlProductVer", item.Key)) {
                            $("#ddlProductVer").addOption(item.Key, item.Key);
                            //
                            $("#ddlProductVer2").addOption(item.Key, item.Key);
                        }
                    });
                    sortDropDownListByValue("#ddlProductVer");
                    $("#ddlProductVer").selectOptions("");
                    //
                    sortDropDownListByValue("#ddlProductVer2");
                    $("#ddlProductVer2").selectOptions("");
                }
            },
            error: function (response) {
                alert(g_systemErrMsg + "(ProductVersion)");
            },
            complete: function (response) {
                ShowLoadImg("imgProductVersionLoading", "none");
                $("#ddlProductVer").attr("disabled", false);
                //
                ShowLoadImg("imgProductVersionLoading2", "none");
                $("#ddlProductVer2").attr("disabled", false);
                //
                GetProductOS($("#ddlProductVer").val());
            }
        });
    }
}

function GetProductOS(inProductVersion) {
    $("#ddlProductOS2").empty;
    $("#ddlProductOS2").removeOption(/./);
    $("#ddlProductOS2").addOption("", g_selectStrProductOS);

    if (inProductVersion != "") {
        $("#ddlProductOS2").attr("disabled", true);
        ShowLoadImg("imgProductOSLoading2", "");

        if (g_jsonProductVerAndOS) {
            $.each(g_jsonProductVerAndOS, function (index, item) {
                if (inProductVersion == item.Key)
                    $("#ddlProductOS2").addOption(item.Value, item.Value);
            });
        }
        $("#ddlProductOS2").selectOptions("");
        ShowLoadImg("imgProductOSLoading2", "none");
        $("#ddlProductOS2").attr("disabled", false);
    }
}

function ValidateStep1() {
    var productName = $("#ddlProduct").val();
    var productVesion = $("#ddlProductVer").val();

    if (productName == '') {
        alert('「製品」を選択してください');
        return false;
    }
    else if (productVesion == '') {
        alert('「製品バージョン」が選択されていません。\r製品バージョンが不明な場合は「バージョン不明」を選択してください。');
        return false;
    }
    return true;
}

function ValidateStep2() {
    if (!TestRequiredInput($("#txtName").val())) {
        alert("「氏名」を入力してください");
        $("#txtName").focus();
        return false;
    }
    else if (!TestRequiredInput($("#txtFurigana").val())) {
        alert("フリガナを入力してください。");
        $("#txtFurigana").focus();
        return false;
    }
    else if (!TestRequiredInput($("#txtSerialNo").val())) {
        alert("「シリアル番号/アクティベーションコード」を入力してください");
        $("#txtSerialNo").focus();
        return false;
    }
    else if (!TestRequiredInput($("#txtEmail").val())) {
        alert("[メールアドレス] を入力してください");
        $("#txtEmail").focus();
        return false;
    }
    else if (!TestEmail($("#txtEmail").val())) {
        alert("「メールアドレス」の入力が有効ではありません。 \n username@domain.ne.jpのような形式で入力してください");
        $("#txtEmail").focus();
        return false;
    }
    else if (!TestRequiredInput($("#txtEmailConfirmation").val())) {
        alert("「確認用のメールアドレス」を入力してください");
        $("#txtEmailConfirmation").focus();
        return false;
    }
    else if ($("#txtEmail").val() != $("#txtEmailConfirmation").val()) {
        alert("「メールアドレス」が確認用のものと一致していません");
        $("#txtEmailConfirmation").focus();
        return false;
    }
    else if (!TestRequiredInput($("#txtPhoneBox1").val()) || !TestRequiredInput($("#txtPhoneBox2").val())
        || !TestRequiredInput($("#txtPhoneBox3").val())) {
        alert("「電話番号」を入力してください");
        $("#txtPhoneBox1").focus();
        return false;
    }
    else if (!TestInputType($("#txtPhoneBox1").val(), "[^0-9]")) {
        alert("「電話番号」は半角数字で入力してください");
        $("#txtPhoneBox1").focus();
        return false;
    }
    else if (!TestInputType($("#txtPhoneBox2").val(), "[^0-9]")) {
        alert("「電話番号」は半角数字で入力してください");
        $("#txtPhoneBox2").focus();
        return false;
    }
    else if (!TestInputType($("#txtPhoneBox3").val(), "[^0-9]")) {
        alert("「電話番号」は半角数字で入力してください");
        $("#txtPhoneBox3").focus();
        return false;
    }
    else if ($("#ddlProduct2").val() == "") {
        alert("「製品」を選択してください");
        $("#ddlProduct2").focus();
        return false;
    }
    else if ($("#ddlProductVer2").val() == "") {
        alert("「製品バージョン」が選択されていません。 \n 製品バージョンが不明な場合は「バージョン不明」を選択してください。");
        $("#ddlProductVer2").focus();
        return false;
    }
    else if ($("#ddlProductOS2").val() == "") {
        alert("「使用OS」が選択されていません");
        $("#ddlProductOS2").focus();
        return false;
    }
    else if ($('input[name=agree]:checked').length == 0) {
        alert("個人情報の取り扱い/秘密情報保持契約 \n 「同意する」、「同意しない」どちらかを選択してください");
        $("#srfAgree").focus();
        return false;
    }

    return true;
}

function ValidateStep3_Products() {
    var l1 = $("#txtCurrentStatus").val().length;
    var l2 = $("#txtErrorMessage").val().length;
    var l3 = $("#txtActionTaken").val().length;
    var l4 = $("#txtStepsToReproduce").val().length;
    var l5 = $("#txtRelatedAppVersions").val().length;
    var l6 = $("#txtInquiryContent").val().length;

    if (!TestRequiredInput($("#txtInquiryContent").val())) {
        alert("「お問い合わせ内容」を入力してください");
        $("#txtInquiryContent").focus();
        return false;
    }
    else if ((l1 + l2 + l3 + l4 + l5 + l6) > 15000) {
        var msg = "「お問い合わせ内容」を入力してください\n";
        msg = msg + "お問合せ内容として入力いただいている文字数の合計を\n";
        msg = msg + "15000文字程度にした上で再度登録をお願いします";
        alert(msg);
        $("#txtInquiryContent").focus();
        return false;
    }

    return true;
}

function ValidateStep3_Virus() {

    var l1 = $("#txtVirusInquiryContent").val().length;
    var l2 = $("#txtDetectionLocation").val().length;

    if (!TestRequiredInput($("#txtPatternFileNo").val())) {
        alert("「パターンファイル番号」を入力してください ");
        $("#txtPatternFileNo").focus();
        return false;
    }
    else if (!TestNumeric($("#txtPatternFileNo").val())) {
        alert("「パターンファイル番号」はドットと半角数字で入力してください。(例)1.655.00");
        $("#txtPatternFileNo").focus();
        return false;
    }
    else if (!TestRequiredInput($("#txtVirusSEVersion").val())) {
        alert("「ウイルス検索エンジンバージョン」を入力してください ");
        $("#txtVirusSEVersion").focus();
        return false;
    }
    else if (!TestRequiredInput($("#txtVirusName").val())) {
        alert("「ウイルス名」を入力してください ");
        $("#txtVirusName").focus();
        return false;
    }
    else if (!TestRequiredInput($("#txtVirusInquiryContent").val())) {
        alert("「お問い合わせ内容」を入力してください");
        $("#txtVirusInquiryContent").focus();
        return false;
    }
    else if ((l1 + l2) > 15000) {
        var msg = "「お問い合わせ内容」を入力してください\n";
        msg = msg + "お問合せ内容として入力いただいている文字数の合計を\n";
        msg = msg + "15000文字程度にした上で再度登録をお願いします";
        alert(msg);
        $("#txtVirusInquiryContent").focus();
        return false;
    }

    return true;
}

function GoToStep3() {
    $('#txtSerialNo').val($('#txtSerialNo').val().replace(/　/ig, "").replace(/ /ig, "")); //modify this in 2012/2/2
    var fullSerialNumber = $('#txtSerialNo').val();
    var srType = GetSRType();
    var product = $("#ddlProduct2").val();
    var productVer = $("#ddlProductVer2").val();

    if ($('input[name=agree]:checked').val() == 'No') {
        $("#divStep2").css("display", "none");
        $("#divStep3").css("display", "");
        $("#divAgreement").css("display", "");
        $(window).scrollTop(0);
    }
    else {
        $("#btnGoToStep3").attr("disabled", true);
        ShowLoadImg("imgValidateSNLoading", "");

        $.ajax({
            url: '../WebService/SerialNumValidationHandler.ashx',
            type: 'GET',
            cache: false,
            async: true,
            data: { SRType: srType, SerialNum: fullSerialNumber, Segment: 'Corporate', Product: product, ProductVer: productVer },
            error: function (xhr, ajaxOptions, thrownError) {
                alert(g_systemErrMsg);
            },
            success: function (response) {
                if (response == '') {
                    alert(g_systemErrMsg);
                }
                else {
                    var jsonResult = $.evalJSON(response);
                    if (jsonResult.Key == "True") {

                        $("#divStep3").css("display", "");

                        if (srType == "Products") {
                            $("#divProduct").css("display", "");
                        }
                        else {
                            $("#divVirus").css("display", "");
                        }

                        GaAndCoremetricsTracking("3");
                    }
                    else {
                        //need to fix
                        $("#lblErrorMsg").html(jsonResult.Value);
                        $("#divError").css("display", "");
                    }
                }
                $("#divStep2").css("display", "none");
                $(window).scrollTop(0);
            },
            complete: function (response) {
                ShowLoadImg("imgValidateSNLoading", "none");
                $("#btnGoToStep3").attr("disabled", false);                
            }
        });
    }
}

function GoToStep4() {
    $("#divStep3").css("display", "none");
    $("#divStep4").css("display", "");
    $(".trProduct").css("display", "none");
    $(".trVirus").css("display", "none");
    //
    $("#lblName").html($("#txtName").val());
    $("#lblFurigana").html($("#txtFurigana").val());
    $("#lblSerialNo").html($("#txtSerialNo").val());
    $("#lblPortalAccountName").html($("#txtCompany").val());
    $("#lblDepartmentName").html($("#txtDepartmentName").val());
    $("#lblEmailAdress").html($("#txtEmail").val());
    $("#lblContactNo").html($("#txtPhoneBox1").val() + '-' + $("#txtPhoneBox2").val() + '-' + $("#txtPhoneBox3").val());
    $("#lblReplyViaPhone").html($("input[name=available]:checked").attr("title"));
    $("#lblProductName").html($("#ddlProduct2").val());
    $("#lblProductVersion").html($("#ddlProductVer2").val());
    $("#lblOSName").html($("#ddlProductOS2").val());
    $("#lblInquiryType").html($('input[name=support]:checked').attr("title"));

    var srType = GetSRType();

    if (srType == "Products") {
        $(".trProduct").css("display", "");
        //<!-- Product Inquiry -->
        $("#lblProblemCategory").html($("input[name=problemcategory]:checked").attr("title"));
        $("#lblCurrentStatus").html(htmlEncodeWithBR($("#txtCurrentStatus").val()));
        $("#lblErrorMessage").html(htmlEncodeWithBR($("#txtErrorMessage").val()));
        $("#lblActionTaken").html(htmlEncodeWithBR($("#txtActionTaken").val()));
        $("#lblStepsToReproduce").html(htmlEncodeWithBR($("#txtStepsToReproduce").val()));
        $("#lblRelatedAppVersions").html(htmlEncodeWithBR($("#txtRelatedAppVersions").val()));
        $("#lblInquiryContent").html(htmlEncodeWithBR($("#txtInquiryContent").val()));
        $("#lblFileNameLocation").html($("#hidProductOriginFileName").val());
    }
    else {
        $(".trVirus").css("display", "");
        //<!-- Virus Inquiry -->
        $("#lblVirusSearchMethod").html($("input[name=searchmethod]:checked").attr("title"));
        $("#lblProductSettings").html($("input[name=prodsettings]:checked").attr("title"));
        $("#lblProductSettingsWhenDetected").html($("input[name=prodsettingsdetected]:checked").attr("title"));
        $("#lblPatternFileNumber").html($("#txtPatternFileNo").val());
        $("#lblVirusSearchEngineVersion").html($("#txtVirusSEVersion").val());
        $("#lblVirusName").html($("#txtVirusName").val());
        $("#lblDetectionLocation").html(htmlEncodeWithBR($("#txtDetectionLocation").val()));
        $("#lblVirusInquiryContent").html(htmlEncodeWithBR($("#txtVirusInquiryContent").val()));
        $("#lblFileNameLocation").html($("#hidVirusOriginFileName").val());
    }
    $(window).scrollTop(0);
    GaAndCoremetricsTracking("4");
}

function GoToStep5() {
    $("#divStep4").css("display", "none");
    $("#divStep5").css("display", "");
    $(window).scrollTop(0);
    GaAndCoremetricsTracking("5");
}

function GetSRType() {
    var srType = $('input[name=support]:checked').val();
    return srType;
}

function SubmitForm() {
    ShowLoadImg("imgSubmitSRFLoading", "");
    $("#btnSubmitSRF").attr("disabled", true);
    var v_obj_form = new GetFormObj();
    $.ajax({
        url: '../WebService/SubmitHandler.ashx',
        type: 'POST',
        cache: false,
        async: true,
        data: { Method: 'Submit', FormInfoJSON: encodeURIComponent($.toJSON(v_obj_form)), Segment: 'Corporate' },
        error: function (jqXHR, textStatus, errorThrown) {
            alert(g_systemErrMsg + "(Submit:" + textStatus + ")");
        },
        success: function (response) {
            if (response == "Success") {
                GoToStep5();
            }
            else {
                alert(g_systemErrMsg + "(Submit)");
            }
        },
        complete: function (response) {
            ShowLoadImg("imgSubmitSRFLoading", "none");
            $("#btnSubmitSRF").attr("disabled", false);
        }
    });
}
function GetFormObj() {
    this.FullName = $("#txtName").val();
    this.Furigana = $("#txtFurigana").val();
    this.SerialNumber = $("#txtSerialNo").val();
    this.CompanyName = $("#txtCompany").val();
    this.DepartmentName = $("#txtDepartmentName").val();
    this.Email = $("#txtEmail").val();
    this.ContactNumber = $("#txtPhoneBox1").val() + '-' + $("#txtPhoneBox2").val() + '-' + $("#txtPhoneBox3").val();
    this.AllowPhoneCall = $("input[name=available]:checked").val();
    this.ProductName = $("#ddlProduct2").val();
    this.ProductVersion = $("#ddlProductVer2").val();
    this.OS = $("#ddlProductOS2").val();
    this.SRType = $('input[name=support]:checked').attr("title");

    var srType = GetSRType();

    if (srType == "Products") {
        //<!-- Virus Inquiry -->
        this.HowSearchVirus = "";
        this.PCAndSE = "";
        this.PCAndSTDP = "";
        this.PatternNumber = "";
        this.ScanEngine = "";
        this.MalwareName = "";
        this.DetectedLocation = "";
        //<!-- Product Inquiry -->
        this.ProblemCategory = $("input[name=problemcategory]:checked").attr("title");
        this.CurrentStatus = $("#txtCurrentStatus").val();
        this.ErrorMessageContent = $("#txtErrorMessage").val();
        this.ActionTaken = $("#txtActionTaken").val();
        this.StepsToReproduce = $("#txtStepsToReproduce").val();
        this.RelatedAppVersions = $("#txtRelatedAppVersions").val();
        this.Description = $("#txtInquiryContent").val();
        this.AttachmentFilePath = $("#hidProductUploadFilePath").val();
        this.AttachmentOriginalFileName = $("#hidProductOriginFileName").val();
    }
    else {
        //<!-- Product Inquiry -->
        this.ProblemCategory = "";
        this.CurrentStatus = "";
        this.ErrorMessageContent = "";
        this.ActionTaken = "";
        this.StepsToReproduce = "";
        this.RelatedAppVersions = "";
        //<!-- Virus Inquiry -->
        this.HowSearchVirus = $("input[name=searchmethod]:checked").attr("title");
        this.PCAndSE = $("input[name=prodsettings]:checked").attr("title");
        this.PCAndSTDP = $("input[name=prodsettingsdetected]:checked").attr("title");
        this.PatternNumber = $("#txtPatternFileNo").val();
        this.ScanEngine = $("#txtVirusSEVersion").val();
        this.MalwareName = $("#txtVirusName").val();
        this.DetectedLocation = $("#txtDetectionLocation").val();
        this.Description = $("#txtVirusInquiryContent").val();
        this.AttachmentFilePath = $("#hidVirusUploadFilePath").val();
        this.AttachmentOriginalFileName = $("#hidVirusOriginFileName").val();

        if ($("#chkMultipleLayer").attr("checked") == true)
            this.MultipleLayerForAttachment = true;
        else
            this.MultipleLayerForAttachment = false;
    }
}


//Coremetric And GA

//for cm
function GaAndCoremetricsTracking(stepN) {
    try
    {
        //Coremetrics
        var url = window.location.hostname + window.location.pathname + '/step' + stepN + ".aspx";
        cmPageID = document.title.substring(0, 50) + "::" + url;
        if (cmErrorCode == null) {
            cmCreatePageviewTag(cmPageID, cmCategoryID, cmSearchString, cmSearchResults, cmAttributeString);
        } else {
            cmCreateErrorTag(cmErrorCode + " Error Page", "ERROR");
        }
        //GA
        var url2 = window.location.href + '/Step' + stepN + ".aspx";
        pageTracker._trackPageview(url2);
    }catch(err){}
}

//Conmmon

function OpenProductDialog(url) {
    showPopWin(url, 500, 200, returnRefresh);
}

function OpenVirusDialog(url) {
    showPopWin(url, 500, 200, returnRefreshVirus);
}

function ReplaceToBR(str) {
    return str.replace(/\n/g, "<br />");
}


function ShowLoadImg(id, display) {
    $("#" + id).attr("src", "../image/corp_images/File-loader.gif");
    $("#" + id).css("display", display);
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

function searchSel(objId, keyword) {
    var options = document.getElementById(objId).options;
    for (var i = 0; i < options.length; i++) {
        if (options[i].value == keyword) {
            return true;
        }
    }
    return false;
}

function sortDropDownListByValue(selectId) {
    $(selectId).html($(selectId + " option").sort(function (a, b) {
        return a.value == b.value ? 0 : a.value < b.value ? -1 : 1
    }))
}

function TestRequiredInput(val) {
    var ret = true;
    val = val.replace(/^\s+|\s+$/g, ""); //trim
    if (eval(val.length) == 0) {
        ret = false;
    } //if 
    return ret;
}

function TestInputType(val, strRegExp) {
    var ret = true;
    var charpos = val.search(strRegExp);
    if (val.length > 0 && charpos >= 0) {
        ret = false;
    } //if 
    return ret;
}

function TestEmail(val) {
    var ret = true;
    if (val.length > 0 && !validateEmail(val)) {
        ret = false;
    } //if 
    return ret;
}

function TestNumeric(sText) {
    var ValidChars = "0123456789.";
    var IsNumber = true;
    var Char;
    for (i = 0; i < sText.length && IsNumber == true; i++) {
        Char = sText.charAt(i);
        if (ValidChars.indexOf(Char) == -1) {
            IsNumber = false;
        }
    }
    return IsNumber;
}

function validateEmail(email) {
    var emailRegxp = /^[\\~a-zA-Z0-9._-]+@[\\~a-zA-Z0-9._-]+\.[a-zA-Z]{2,4}$/;
    return emailRegxp.test(email);
}

function detectFlash() { //need to bigger than 9.0.24 for uploadify
    var playerVersion = swfobject.getFlashPlayerVersion(); // returns a JavaScript object
    if ((playerVersion.major == "9" && playerVersion.minor == "0")
        || playerVersion.major == "8" || playerVersion.major == "7" || playerVersion.major == "6"
        || playerVersion.major == "5" || playerVersion.major == "4" || playerVersion.major == "3"
        || playerVersion.major == "2" || playerVersion.major == "1" || playerVersion.major == "0")  
        return false;
    else
        return true;
}
function htmlEncodeWithBR(value) {
    //create a in-memory div, set it's inner text(which jQuery automatically encodes)
    //then grab the encoded contents back out.  The div never exists on the page.
    return $('<div/>').text(value).html().replace(/[\r\n]/g, "<br/>").replace(/   /g, "&nbsp;");
}