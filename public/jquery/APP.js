//Variable Global de Empresa y Usuario
var masterEmpresa = "";
var masterUsuario = "";

//Contenedor General
function contentPage(ContenedorGlobal) {
    $("#content_master").hide();
    $("#loader_sys").show();
    $("#content_master").load(ContenedorGlobal, function () {
        setTimeout("$('#content_master').show(200);", 500); 
        setTimeout("$('#loader_sys').hide();", 500);
    });
}

//---------------------------------------------------------------------------------------------------------------------------
//Ajax SAC Controller
//---------------------------------------------------------------------------------------------------------------------------
function AjaxSAC(controllerAction, dataPost, loader, callback) {
    if (loader){$("#loader_sys").show();}
    $.ajax({
        url: controllerAction,
        type: "post",
        data: dataPost,
        success: function (data) {
            $("#loader_sys").hide();
            callback(data);
        }, error: function (jqXHR, ajaxOptions, thrownError) {
            $("#loader_sys").hide();
            alert(formatErrorMessage(jqXHR, ajaxOptions));
        }
    });
}


//---------------------------------------------------------------------------------------------------------------------------
//Respuestas de Error
//---------------------------------------------------------------------------------------------------------------------------
function formatErrorMessage(jqXHR, exception) {
    if (jqXHR.status === 0) { return ('Not connected.\nPlease verify your network connection.'); }
    else if (jqXHR.status == 404) { return ('The requested page not found. [404]'); }
    else if (jqXHR.status == 500) { return ('Internal Server Error [500].'); }
    else if (exception === 'parsererror') { return ('Requested JSON parse failed.'); }
    else if (exception === 'timeout') { return ('Time out error.'); }
    else if (exception === 'abort') { return ('Ajax request aborted.'); }
    else {
        return ('Uncaught Error.\n' + jqXHR.responseText);
    }
}

//---------------------------------------------------------------------------------------------------------------------------
//Eventos de Escritura onKeyPress
//---------------------------------------------------------------------------------------------------------------------------
function validaEvento(e) {
    var keynum;
    if (window.event)
        { keynum = e.keyCode; }
    else if (e.which)
        { keynum = e.which; }
    return keynum;
}


//---------------------------------------------------------------------------------------------------------------------------
//Alertas de Sistema
//---------------------------------------------------------------------------------------------------------------------------
function alerta(alert_mensaje) {
    $("#alert_sys").show();
    $("#alert_titulo").html("Sac Ventas");
    $("#alert_mensaje").html(alert_mensaje);
    setTimeout(function () {$("#alert_button").focus();}, 100);
}


//---------------------------------------------------------------------------------------------------------------------------
//Alertas de Sistema - Cerrar
//---------------------------------------------------------------------------------------------------------------------------
function alerta_cerrar() {
    $("#alert_sys").hide();
}

//---------------------------------------------------------------------------------------------------------------------------
//Ejecuciones con Timers de Pagina
//---------------------------------------------------------------------------------------------------------------------------
function AppTimers() {
    //Notificaciones Top
    //-------------------------------------------------------------
    AppGestorNotificacion();
    setInterval(function () { AppGestorNotificacion(); }, 600000); //10 minutos
}

//Notificaciones Top
function AppGestorNotificacion() {
    AjaxSAC("/Index/AppGestorNotificacion", '', false, function (callback) {
        $("#AppGestorNotificacion_Top").html(callback);
    });
}

//---------------------------------------------------------------------------------------------------------------------------
//Carga option en Contenedor
//---------------------------------------------------------------------------------------------------------------------------
function loadOption(option) {
    var html="";
    BDConsultaOBJ("SELECT * FROM APP_MENU;", function (obj) {
        for (var i = 0; i < obj.rows.length; i++) {
            var row = obj.rows.item(i);
            if(option==row.IDMENU)
            {
                $("#App_content").html(unescape(row.HTML));
            }
        }
    });
}

//---------------------------------------------------------------------------------------------------------------------------
//Enter para buscador
//---------------------------------------------------------------------------------------------------------------------------
function searchEnter(evento) {
    var key = validaEvento(evento);
    if (key == 13) { searchList(); } else { return true; }
}


//---------------------------------------------------------------------------------------------------------------------------
//Pagineo Derecha
//---------------------------------------------------------------------------------------------------------------------------
function searchList() {
        var dataPost = {
            txt_search: $("#txt_search").val(),
            var_PaginaActual: 1,
        };
        AjaxSAC(controller, dataPost, true, function (callback) {
            $("#AppList").html(callback);
        });
    }

//---------------------------------------------------------------------------------------------------------------------------
//Pagineo Derecha
//---------------------------------------------------------------------------------------------------------------------------
function searchListPagDerecha_() {
    var dataPost = {
        txt_search: $("#txt_search").val(),
        var_PaginaActual: parseInt($("#hdn_pagina").val()) + 1
    };
    AjaxSAC(controller, dataPost, true, function (callback) {
        $("#AppList").html(callback);
    });
}

//---------------------------------------------------------------------------------------------------------------------------
//Pagineo Izquierda
//---------------------------------------------------------------------------------------------------------------------------
function searchListPagIzquierda_() {
    var dataPost = {
        txt_search: $("#txt_search").val(),
        var_PaginaActual: parseInt($("#hdn_pagina").val()) - 1
    };
    AjaxSAC(controller, dataPost, true, function (callback) {
        $("#AppList").html(callback);
    });
}

//---------------------------------------------------------------------------------------------------------------------------
//Edit Formulario 
//---------------------------------------------------------------------------------------------------------------------------
function AppNuevo() {
    var dataPost = {
        txt_id: ''
    };
    AjaxSAC(controller+'Edit', dataPost, true, function (callback) {
        $("#AppContent_Edit").html(callback);
        $("#AppContent_List").hide();
        $("#AppContent_Edit").show();

        searchList();
    });
}

//---------------------------------------------------------------------------------------------------------------------------
//Edit Formulario 
//---------------------------------------------------------------------------------------------------------------------------
function AppEdit(id) {
    var dataPost = {
        txt_id: id
    };
    AjaxSAC(controller+'Edit', dataPost, true, function (callback) {
        $("#AppContent_Edit").html(callback);
        $("#AppContent_List").hide();
        $("#AppContent_Edit").show();

        searchList();
    });
}

//---------------------------------------------------------------------------------------------------------------------------
//Cerrar Edit Formulario 
//---------------------------------------------------------------------------------------------------------------------------
function edit_cerrar() {
    $("#AppContent_Edit").html("");
    $("#AppContent_List").show();
    $("#AppContent_Edit").hide();
    searchList();
}

//---------------------------------------------------------------------------------------------------------------------------
//Delete Formulario 
//---------------------------------------------------------------------------------------------------------------------------
function AppDelete(id) {
    var dataPost = {
        txt_id: id
    };
    AjaxSAC(controller+'Delete', dataPost, true, function (callback) {
        alert(callback);
        searchList();
    });
}

//---------------------------------------------------------------------------------------------------------------------------
//Marcado de Checks
//---------------------------------------------------------------------------------------------------------------------------
function AppMarcarChecks() {
    var checks="";
    
    if($("#hdn_checks").val()=="0")
    {
        $("input:checkbox").each(function () {
            try{
            $("#"+$(this).attr('id')).prop('checked',true);
            }catch(e){}
        });
        $("#hdn_checks").val("1");
    }
    else
    {
        $("input:checkbox").each(function () {
            $("#"+$(this).attr('id')).prop('checked',false);
        });
        $("#hdn_checks").val("0");
    }
}

//---------------------------------------------------------------------------------------------------------------------------
//Eliminado de Registros marcados por Checks
//---------------------------------------------------------------------------------------------------------------------------
function AppEliminar() {
    var checks="";
    $("input:checkbox:checked").each(function () {
        checks=checks+($(this).attr('id'))+'|';
    });

    if(checks=='')
    {
        alert("Por favor seleccionar un elemento");
        return false;
    }
    else
    {
        var dataPost = {
            txt_cadena: checks
        };
        AjaxSAC(controller+'DeleteChecks', dataPost, true, function (callback) {
            alert(callback);
            searchList();
        });
    }
}

function fecActual() {
    var currentdate = new Date();
    var Year    = currentdate.getFullYear();
    var mes     = currentdate.getMonth() + 1;
    var day = currentdate.getDate();
    var hour    = currentdate.getHours();
    var minute = currentdate.getMinutes();
    var second = currentdate.getSeconds();

    if (String(mes).length == 1) {
        mes = '0' + mes;
    }
    if (String(day).length == 1) {
        day = '0' + day;
    }
    if (String(hour).length == 1) {
        hour = '0' + hour;
    }
    if (String(minute).length == 1) {
        minute = '0' + minute;
    }
    if (String(second).length == 1) {
        second = '0' + second;
    }

    var datetime = Year + "-" + mes + "-" + day + " " + hour + ":" + minute + ":" + second;
    return datetime;
}

function horaActual() {
    var currentdate = new Date();
   
    var hour    = currentdate.getHours();
    var minute = currentdate.getMinutes();
    var second = currentdate.getSeconds();

    if (String(hour).length == 1) {
        hour = '0' + hour;
    }
    if (String(minute).length == 1) {
        minute = '0' + minute;
    }
    if (String(second).length == 1) {
        second = '0' + second;
    }

    var hourTime = hour + ":" + minute + ":" + second;
    return hourTime;
}
//---------------------------------------------------------------------------------------------------------------------------
//Creando Eventos
//---------------------------------------------------------------------------------------------------------------------------
function newEvent(y,m,d,h,m,optiontile,optioncolor){
    var events = {start: new Date(y, m, d, h, m), title : optiontile ,backgroundColor: optioncolor};
	$('#calendar').fullCalendar( 'addEvent', events )
	$('#calendar').fullCalendar('renderEvent', events, true);		
}

//---------------------------------------------------------------------------------------------------------------------------
//Inicializa FullCalendar
//---------------------------------------------------------------------------------------------------------------------------
function iniCalendar() {             
  $('#calendar').fullCalendar({
    header: {left: 'prev,next today',center: '',right: 'title'},
    buttonText: {today: 'today',month: 'month',week: 'week'},
	defaultView: 'agendaWeek',
	eventClick: function (calEvent, jsEvent, view) {
		 $("#dialog").dialog({autoOpen: false, width: 130,});
         $("#idClie").val(calEvent.id);
         $('#dialog').dialog('open');
	},
    events: [
            {
              title: 'All Day Event',
              start: new Date(2015,11, 22),
              backgroundColor: "#f56954", 
              borderColor: "#f56954" 
            }
            ],
    editable: true,
    droppable: false,
	timezone: 'UTC'
});		
}

//Solo Numeros
function SoloNumero(idnum){
   $("#"+idnum).numeric(".");
}

//Solo Numeros
function SoloNumeroCantidad(idnum){
   $("#"+idnum).numeric("");
}

//Solo Numeros verificar Vacios
function SoloNumeroEmpty(idnum){
   if($("#"+idnum).val()==''){return 0;}
   return $("#"+idnum).val();
}


//------------------------------Modificar------------------------------------------
//
//---------------------------------------------------------------------------------------------------------------------------
//Metodo Multibusqueda
//---------------------------------------------------------------------------------------------------------------------------
function searchOdoo(ColumNames,ItemSearch){
       $( "#"+ItemSearch ).autocomplete({
           source: function (request,response){
            response(ColumNames)
           },  
           multiselect: true,
           change:function(){
                $( "#"+ItemSearch ).val("");
           }       
       });
}

//---------------------------------------------------------------------------------------------------------------------------
//Guardar Busquedas en input temporal
//---------------------------------------------------------------------------------------------------------------------------
function storeSearch(ItemStore){
    var tempSearch = $("#"+ItemStore).val();
    $("#"+ItemStore).val(tempSearch);
}

//---------------------------------------------------------------------------------------------------------------------------
//Busqueda y Carga de lista 
//---------------------------------------------------------------------------------------------------------------------------
function searchOdooEnter(RETORNO){
    var searchField = document.getElementsByName("searchOdoo");
    var searchStrTemp="";
    var searchStr="";
    var indice=0;

    if(searchField.length != 0){

        for (var i = 0; i < searchField.length ; i++) {
            searchStrTemp = searchField[i].textContent;
            if(indice == 0){
                searchStrTemp = " AND ( "+searchStrTemp.replace(":", " LIKE '%")+"%' ";
                indice++;
            }else{
                searchStrTemp = " AND "+searchStrTemp.replace(":", " LIKE '%")+"%' ";
            }
            searchStr=searchStr+searchStrTemp;
        }
        searchStr=searchStr+" )";
    }
    RETORNO(searchStr);
}

function startCursor(obj){
    $("#"+obj).focus(function() {
        setTimeout((function(el) {
            var strLength = el.value.length;
            return function() {
                if(el.setSelectionRange !== undefined) {
                    el.setSelectionRange(strLength, strLength);
                } else {
                    $(el).val(el.value);
                }
        }}(this)), 0);
    });
}

function masterTableComparer(tableCondition,insertCondition){
    BDConsulta("SELECT COUNT(*) AS 'CONT' FROM "+tableCondition , function (objIni) { 
        Count = objIni.CONT;
        if(Count>0){
            BDActualizacion("DELETE FROM "+tableCondition);
            BDActualizacion(insertCondition);
        }else{
            BDActualizacion(insertCondition);
        }
    });
}


