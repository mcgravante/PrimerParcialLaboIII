var globalTr="";
var spinner = "";
var http = new XMLHttpRequest();
var contenedorAgregar="";
var today = new Date();


        window.onload = function ()
        {
            
            GetMaterias();
            var modificar = document.getElementById("btnModificar");
            spinner = document.getElementById("loader");
            var cerrar = document.getElementById("cerrar");
            cerrar.onclick=CerrarRecuadro;
            modificar.onclick=PostEditMateria;
            var eliminar = document.getElementById("btnEliminar");
            eliminar.onclick=DeleteMateria;

        }

        function GetMateriasFunction(metodo,url,funcion)
        {
            spinner.hidden=false;
            http.onreadystatechange=funcion;
            
            http.open(metodo,url,true);
            http.send();
        }
        function PostEditMateriaFunction(metodo,url,funcion)
        {
            var isValid=true;
            spinner.hidden=false;
            http.onreadystatechange=funcion;
            http.open(metodo,url,true);
            http.setRequestHeader("Content-Type","application/json");
            var nombre = document.getElementById("nombre");
            var cuatrimestre = document.getElementById("cuatrimestre");
            var fechaFinal=document.getElementById("fechaFinal");
            var id = document.getElementById("id");
            var turno = document.querySelector('input[name="turno"]:checked');
            if (checkValidParameters()){
                var data = {id:id.value,nombre:nombre.value,cuatrimestre:cuatrimestre.value,fechaFinal:fechaFinal.value,turno:turno.value};
                fechaFinal.classList.add('defaultInput');
                fechaFinal.classList.remove('error');
                nombre.classList.add('defaultInput');
                nombre.classList.remove('error');
            
            }          
            http.send(JSON.stringify(data));
        }

        function checkValidParameters()
        {
            var isValid = true;
            var nombre = document.getElementById("nombre");
            var fechaFinal=document.getElementById("fechaFinal");
            var fechaFinalToCompare = new Date(fechaFinal.value);
            if (nombre.value.length<=6)
            {
                nombre.classList.remove('defaultInput');
                nombre.classList.add('error');
                isValid=false;
            }
            if (today > fechaFinalToCompare || fechaFinal.value == '')
            {
                fechaFinal.classList.remove('defaultInput');
                fechaFinal.classList.add('error');
                isValid=false;
            }
            return isValid;
        }

        function DeleteMateriaFunction(metodo,url,funcion)
        {
            spinner.hidden=false;
            http.onreadystatechange=funcion;
            http.open(metodo,url,true);
            http.setRequestHeader("Content-Type","application/json");
            var data = {id:document.getElementById("id").value};
            
            http.send(JSON.stringify(data));
        }

        function callback()
        {
            
            if (http.readyState==4 && http.status==200)
            {
                armarTabla(JSON.parse(http.responseText));        
                spinner.hidden=true;  
            }
        }

        function editMateria()
        {
            if (http.readyState==4 && http.status==200)
            {
                Edit(JSON.parse(http.responseText));
                spinner.hidden=true;
            }
        }

        function deleteMateria()
        {
            if (http.readyState==4 && http.status==200)
            {
                
                Delete(JSON.parse(http.responseText));
                spinner.hidden=true;

            }
        }


        function GetMaterias()
        {
            GetMateriasFunction("GET","http://localhost:3000/materias",callback);
        }

        function PostEditMateria()
        {
            PostEditMateriaFunction("POST","http://localhost:3000/editar",editMateria);

        }

        function DeleteMateria()
        {
            DeleteMateriaFunction("POST","http://localhost:3000/eliminar",deleteMateria);
        }

        
        function armarTabla(jsonObj)
        {
            var tabla = document.getElementById("tabla");
           
            for(var i = 0;i<jsonObj.length;i++)
            {
                var tr = document.createElement("tr");
                var td = document.createElement("td");
                td.appendChild(document.createTextNode(jsonObj[i].nombre));
                tr.appendChild(td);

                var td2 = document.createElement("td");
                td2.appendChild(document.createTextNode(jsonObj[i].cuatrimestre));
                tr.appendChild(td2);

                var td3 = document.createElement("td");
                td3.appendChild(document.createTextNode(jsonObj[i].fechaFinal));
                tr.appendChild(td3);

                var td4 = document.createElement("td");
                td4.appendChild(document.createTextNode(jsonObj[i].turno));
                tr.appendChild(td4); 

                var td5 = document.createElement("td");
                td5.appendChild(document.createTextNode(jsonObj[i].id));
                td5.hidden=true;
                tr.appendChild(td5);
                td5.hidden=true;

                tr.addEventListener("dblclick",AbrirRecuadro);
                tabla.appendChild(tr);
            }
           
        }
        

        function AbrirRecuadro(e)
        {
            var recuadro = document.getElementById("contenedorAgregar");
            contenedorAgregar=recuadro;
            recuadro.hidden=false;
            var tr = e.target.parentNode;
            globalTr=tr;
            var nombre = document.getElementById("nombre");
            var cuatrimestre = document.getElementById("cuatrimestre");
            var fechaFinal = document.getElementById("fechaFinal");
            var id = document.getElementById("id");
            var fechaFinalToCompare = new Date(fechaFinal.value);

            nombre.value = tr.childNodes[0].innerHTML;
            cuatrimestre.value = tr.childNodes[1].innerHTML;
            fechaFinal.value = tr.childNodes[2].innerHTML;
            id.value = tr.childNodes[4].innerHTML;

            nombre.onclick=function(){
                checkValidParameters();
            }
           
            fechaFinal.onclick=function(){
                checkValidParameters();
            }

            if (tr.childNodes[3].innerHTML=="Mañana")
            {
                document.getElementById("mañana").checked=true;
            }else if (tr.childNodes[3].innerHTML=="Noche")
            {
                document.getElementById("noche").checked=true;
            }                      
        }

        function Edit(res)
        {
                if (res.type=='ok')
                {
                    globalTr.childNodes[0].innerHTML = document.getElementById("nombre").value;
                    globalTr.childNodes[2].innerHTML= document.getElementById("fechaFinal").value;
                    globalTr.childNodes[3].innerHTML = document.querySelector('input[name="turno"]:checked').value;
                }                         
        }

        function Delete(res)
        {
            if(res.type=='ok')
            {
                globalTr.remove();
            }
        }

        function CerrarRecuadro()
        {
            var recuadro = document.getElementById("contenedorAgregar");
            recuadro.hidden=true;
        }




        
