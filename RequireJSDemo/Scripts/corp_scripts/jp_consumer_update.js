var _caseid;
var _rowid;
var _pagetype;
var g_systemErrMsg = "一時的なネットワークのエラーです。\n少し時間を置き、再度お試しください。\n";

jQuery(document).ready(function () {

	_caseid = $.query.get("caseid");
	_rowid = $.query.get("rowid");

	if (_caseid != "" && _rowid != "") {
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
		$("#txtCustomerResponse").val("");
		return false;
	});

	$("#imgUploadCancel").click(function () {
		$("#imgUploadCancel").hide();
		$("#lblUploadFileName").html("");
		UploadCancel();
	});

});

function Validate() {
	if (!TestRequiredInput($("#txtCustomerResponse").val())) {
		alert("「お問い合わせ内容」を入力してください");
		$("#txtCustomerResponse").focus();
		return false;
	}
	return true;
}

function ShowErrorMsg(caseid) {
	$("#tabUpdate").css("display", "none");
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

function GetCaseInfo() {
	$.ajax({
		type: "GET",
		url: "../WebService/GetCaseInfoHandler.ashx",
		cache: false,
		async: false,
		data: ({ type: "consumer_update", caseID: _caseid, rowID: _rowid }),
		success: function (response) {
			if (response != "") {
				if (response == "nodata") {
					ShowErrorMsg("");
				}
				else if (response == "exception" || response == "closed") {
					ShowErrorMsg(_caseid);
				}
				else {
					var jsonResult = $.evalJSON(response);
					$("#tabUpdate").css("display", "");
					$("#lblProductName").html(jsonResult.ProductName);
					$("#lblProductVersion").html(jsonResult.ProductVersion);
					$("#lblPatternFileNo").html(jsonResult.PatternNumber);
					$("#lblSearchEngineVersion").html(jsonResult.ScanEngine);
					$("#lblOS").html(jsonResult.OS);
					$("#lblVirusName").html(jsonResult.MalwareName);
					$("#txtReply").text(jsonResult.ReplyFromTechSupport);
					$("#lblAttPath").html(jsonResult.AttachmentFilePath);

					var pageType = "";
					if (jsonResult.SRType == "技術的なお問い合わせ" || jsonResult.SRType == "Product Support") {
						$(".trProductUpload").css("display", "");
						pageType = "Products";
						_pagetype = "技術的なお問い合わせ";
					}
					else if (jsonResult.SRType == "契約更新・登録情報について" || jsonResult.SRType == "Contract") {
						$(".trProductUpload").css("display", "");
						pageType = "Contract";
						_pagetype = "契約更新・登録情報について";
					}
					else if (jsonResult.SRType == "ウイルスについて" || jsonResult.SRType == "Malware Support") {
						$(".trVirusUpload").css("display", "");
						$(".trProductUpload").css("display", "none");
						pageType = "Virus";
						_pagetype = "ウイルスについて";
						//Virus Description Word
						if ($('#hid_Corp_Cons_MalwareAtt_None_Zip').val() == 'y') {
							$(".classRTL").show();
							$(".classBeforeRTL").hide();
						}
						else {
							$(".classRTL").hide();
							$(".classBeforeRTL").show();
						}
					}
					else if (jsonResult.SRType == "Incident") {
						window.location.replace("http://jp.trendmicro.com/jp/support/personal/vb/contact/index.html?ConSupWebclickID=about_contact&tmjlink=contents&cm_re=Corp-_-contact-_-cons_user");
					} else
						ShowErrorMsg(_caseid);

					$('#uploadForm').attr("action", "../WebService/UploadWebSrc.ashx?queryString=sharefolder&pageType=" + pageType + "&segment=Consumer");
					SetUploadObject(pageType);
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

function OpenDialog(pageType) {
	$("#dialog").dialog({ modal: true });
}

function SetUploadObject(pageType) {

	var fileExt = "*.*";
	var fileDesc = "";

	//no need to check this
	//    if ($('#hid_Corp_Cons_MalwareAtt_None_Zip').val() == 'y') {
	//        if (pageType == "Virus") {
	//            fileExt = "*.zip;*.rar";
	//            fileDesc = "ZIP/RAR File";
	//            $("#divMultipleCompression").show();
	//        }
	//    }

	if (!detectFlash()) {
		$('#noneFlashDiv').show();
		$('#flashDiv').hide();

		$('#uploadForm').ajaxForm({
			beforeSubmit: function (arr, $form, options) {
				if ($("#fileUploaded").val() == '') {
					alert('ファイルを選択して下さい');
					return false;
				}
				else {
					// no need to check this
					//                    if ($('#uploadForm').attr("action").search("Virus") != -1) {
					//                        if ($('#hid_Corp_Cons_MalwareAtt_None_Zip').val() == 'y') {
					//                            var fileType = $("#fileUploaded").val().split('\\').pop().split('.').pop();
					//                            if (!(fileType.toLowerCase() == 'zip' || fileType.toLowerCase() == 'rar')) {
					//                                alert('.zip　か　.rar　ファイルを選択し、アップロードしてください');
					//                                return false;
					//                            }
					//                        }
					//                    }

					$("#btnUploadSubmit").hide();
					$("#imgbtnSubmit").attr("disabled", true);
					ShowLoadImg("imgUpdateUploadFileLoading", "");
					ShowLoadImg("imgFormUploadFileLoading", "");
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

					$("#hidUploadFilePath").val(filePath);
					$("#hidOriginFileName").val(fileName);
					$("#lblUploadFileName").html(fileName);

					$("#imgUploadCancel").show();
					alert(fileName + " ファイルを添付しました。");
					return;
				}
				else {
					alert(g_systemErrMsg + "(Form Upload Unknow)");
					return;
				}
			},
			error: function (jqXHR, textStatus, errorThrown) {
				alert(g_systemErrMsg + "。(Form Upload:" + textStatus + ")");
			},
			complete: function (jqXHR, textStatus) {
				$("#fileUploaded").replaceWith("<input id='fileUploaded' name='Filedata' type='file' />");
				$("#dialog").dialog("close");
				$("#imgbtnSubmit").attr("disabled", false);
				ShowLoadImg("imgUpdateUploadFileLoading", "none");
				ShowLoadImg("imgFormUploadFileLoading", "none");
				$("#btnUploadSubmit").show();
			}
		});
	}
	else {
		$('#noneFlashDiv').hide();

		//uploader
		$('#UpdateFileUploader').uploadify({
			'uploader': '../Scripts/uploadify/uploadify.swf',
			'script': '../WebService/UploadWebSrc.ashx?queryString=sharefolder%26pageType=' + pageType + "%26segment=Consumer",
			'auto': true,
			'queueID': 'updateUploadQueue',
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
			'fileExt': fileExt,
			'fileDesc': fileDesc,
			'onSelect': function (event, ID, fileObj) {
				$("#imgbtnSubmit").attr("disabled", true);
				ShowLoadImg("imgUpdateUploadFileLoading", "");
			},
			'onComplete': function (event, ID, fileObj, response, data) {

				$("#imgbtnSubmit").attr("disabled", false);
				ShowLoadImg("imgUpdateUploadFileLoading", "none");

				if (response.search("result=failed") != -1) {
					alert(g_systemErrMsg + "(Flash Upload Failed)");
					return;
				}
				else if (response.search("result=success") != -1) {
					$(".uploadifyQueueItem .fileName").html(fileObj.name);
					$("#hidUploadFilePath").val(response.split(',')[1].replace('filepath=', ''));
					$("#hidOriginFileName").val(fileObj.name);
					return;
				}
				else {
					alert(g_systemErrMsg + "(Flash Upload Unknow)");
					return;
				}
			},
			'onProgress': function (event, ID, fileObj, data) {
			},
			'onError': function (event, ID, fileObj, errorObj) {

				$("#imgbtnSubmit").attr("disabled", false);
				ShowLoadImg("imgUpdateUploadFileLoading", "none");

				if (errorObj.type === "File Size")
					alert('アップロードファイルのサイズは50MB以下にしてください。');
				else {
					alert(g_systemErrMsg + "(Flash Upload:" + errorObj.type + " Error: " + errorObj.info + ")");
				}
				return;
			},
			'onCancel': function (event, ID, fileObj, data) {
				UploadCancel();
				return;
			}
		});
	}
}

function UploadCancel() {
	$("#hidUploadFilePath").val('');
	$("#hidOriginFileName").val('');
	$("#imgbtnSubmit").attr("disabled", false);
	ShowLoadImg("imgUpdateUploadFileLoading", "none");
}

function SubmitCase() {
	ShowLoadImg("imgSubmitLoading", "");
	$("#imgbtnSubmit").attr("disabled", true);
	var v_obj_form = new GetFormObj();
	$.ajax({
		type: "POST",
		url: "../WebService/UpdateCaseHandler.ashx",
		cache: false,
		async: true,
		data: ({ CaseId: _caseid, RowId: _rowid, Segment: "Consumer", PageType: _pagetype, FormInfoJSON: encodeURIComponent($.toJSON(v_obj_form)) }),
		success: function (response) {
			if (response == "Success") {
				$("#tabUpdate").css("display", "none");
				$("#tabEnd").css("display", "");
			}
			else {
				alert(g_systemErrMsg + "(Submit Failed)");
				//ShowErrorMsg(_caseid);
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

function GetFormObj() {
	if ($("#chkMultipleLayer").attr("checked") == true)
		this.MultipleLayerForAttachment = true;
	else
		this.MultipleLayerForAttachment = false;

	this.Description = $("#txtCustomerResponse").val() + " " + $("#hidOriginFileName").val();
	this.AttachmentFilePath = $("#hidUploadFilePath").val();
	this.AttachmentOriginalFileName = $("#hidOriginFileName").val();
}

function Count(text, long) {
	var maxlength = new Number(long); // Change number to your max length.
	if (text.value.length > maxlength) {
		var msg = "お問合せ内容が登録文字数の上限に達しています。\n";
		msg = msg + "お問合せ内容として入力いただいている文字数の合計を\n";
		msg = msg + "7000文字程度にした上で再度登録をお願いします。\n"
		alert(msg);
		//text.value = text.value.substring(0, maxlength);
		text.disabled = "disabled";
		text.value = text.value.slice(0, maxlength); //or substr(0, 10)
		text.removeAttribute("disabled");
		text.focus(); // prevent lose focus
	}
}

//common

function ShowLoadImg(id, display) {
	$("#" + id).attr("src", "../image/corp_images/File-loader.gif");
	$("#" + id).css("display", display);
}

function TestRequiredInput(val) {
	var ret = true;
	val = val.replace(/^\s+|\s+$/g, ""); //trim
	if (eval(val.length) == 0) {
		ret = false;
	} //if 
	return ret;
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