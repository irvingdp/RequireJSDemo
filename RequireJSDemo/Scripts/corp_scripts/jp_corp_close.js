var _rowid;
var _caseid;
var g_systemErrMsg = "一時的なネットワークのエラーです。\n少し時間を置き、再度お試しください。\n";

jQuery(document).ready(function () {
    _rowid = getUrlVars()["rowid"];

    if (_rowid != "") {
        GetCaseInfo();
    }
    else {
        ShowErrorMsg("");
    }

    $("#imgbtnSubmit").click(function () {
        if (Validate()) {
            SubmitCase();
        }
        return false;
    });

    $("#imgbtnReset").click(function () {
        return false;
    });
});

function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function GetCaseSurvey() {
    $.ajax({
        type: "GET",
        url: "../WebService/GetCaseInfoHandler.ashx",
        cache: false,
        async: false,
        data: ({ type: "survey", caseID: _caseid, rowID: _rowid }),
        success: function (response) {
            if (response == "nosurvey") {
                //No Need Survey
            }
            else if (response == "nodata") {
                ShowErrorMsg("");
            }
            else if (response == "exception" || response == "closed") {
                ShowErrorMsg(_caseid);
            }
            else {
                $(".trSurvey").css("display", "");
                $("#linkSurvey").attr("href", response);
            }
        },
        error: function (response) {
            ShowErrorMsg(_caseid);
        },
        complete: function (response) {
        }
    });
}

function GetCaseInfo() {
    $.ajax({
        type: "GET",
        url: "../WebService/GetCaseInfoHandler.ashx",
        cache: false,
        async: false,
        data: ({ type: "close", rowID: _rowid }),
        success: function (response) {
            if (response != "") {
                if (response == "nodata") {
                    ShowErrorMsg("");
                }
                else if (response == "exception" || response == "closed") {
                    ShowErrorMsg("");
                }
                else {
                    var jsonResult = $.evalJSON(response);
                    _caseid = jsonResult.GCCSRNumber;
                    $("#tabClose").css("display", "");
                    $("#lblCaseNumber").html(jsonResult.GCCSRNumber);
                    $("#lblLastInquiryDate").html(jsonResult.LastInquiryDate);
                    $("#lblLastReplyDate").html(jsonResult.LastReplyDate);
                    $("#lblProductName").html(jsonResult.ProductName);
                    if (jsonResult.CaseSubStatus == "Sent Close Confirmation") {                    
                        $(".trClose").css("display", "none");
                    }
                    else {
                        $(".trAction").css("display", "none");
                    }
                }
            }
            else
                ShowErrorMsg("");
        },
        error: function (response) {
            ShowErrorMsg(_caseid);
        },
        complete: function (response) {
        }
    });
}

function Validate() {
    return true
}

function SubmitCase() {
    ShowLoadImg("imgSubmitLoading", "");
    $("#imgbtnSubmit").attr("disabled", true);

    if ($("#rbtnProblemNotSolved").attr("checked")) {
        window.location = "UpdateCase.aspx?caseid=" + _caseid + "&rowid=" + _rowid;
    }
    else if ($("#rbtnNotResolvedClose").attr("checked") || $("#rbtnResolved").attr("checked")) {
        var subStates;
        if ($("#rbtnNotResolvedClose").attr("checked"))
            subStates = "closed";
        else
            subStates = "resolved";

        $.ajax({
            type: "POST",
            url: "../WebService/UpdateCaseHandler.ashx",
            cache: false,
            async: true,
            data: ({ SubStates: subStates, CaseId: _caseid, RowId: _rowid }),
            success: function (response) {
                if (response == "Success") {
                    $("#tabClose").css("display", "none");
                    if (subStates == "closed") {
                        $("#tabConfirmEnd").css("display", "");
                    }
                    else if (subStates == "resolved") {
                        $("#tabSurveyEnd").css("display", "");
                        GetCaseSurvey();
                    }
                }
                else {
                    alert(g_systemErrMsg + "(Submit Failed)");
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                alert(g_systemErrMsg + "(Submit:" + textStatus + ")");
            },
            complete: function (response) {
                ShowLoadImg("imgSubmitLoading", "none");
                $("#imgbtnSubmit").attr("disabled", false);
            }
        });
    }
}

function ShowErrorMsg(caseid) {
    $("#tabClose").css("display", "none");
    $("#tabError").css("display", "")

    if (caseid != null && caseid != "") {
        $("#lblTitle").html("サポートセンターお問い合わせフォーム");
        $("#lblSubTitle").html("受付番号");
        $("#lblSolutionID").html(caseid);
        $("#ltrlMessage").html("本件に関してのお取扱いはできません。<br/>再度本件に関しましてお問合わせをいただく場合、お手数ですが上記受付番号をご用意の上、サポートセンターまでお問い合わせください。");
    }
    else {
        $("#lblTitle").html("エラーページ");
        $("#lblSubTitle").html("");
        $("#lblSolutionID").html("");
        $("#ltrlMessage").html("要求されたページは存在しません。<br />お手数ですがURLを確認の上、もう一度お試しください。");
    }
}

//common

function ShowLoadImg(id, display) {
    $("#" + id).attr("src", "../image/corp_images/File-loader.gif");
    $("#" + id).css("display", display);
}