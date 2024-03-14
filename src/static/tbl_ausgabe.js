
function AusgabeFelderManipulieren(DatenAusgabe,ersetzenmatrix) {

    let x
    let matrix = []
DatenAusgabe.forEach(function(m, i) {
 
 let obj = {}
     for (eigenschaft in m) {
         x = eigenschaft
         if (ersetzenmatrix[eigenschaft]) x = ersetzenmatrix[eigenschaft]
        
         
         obj[x] = m[eigenschaft]   
     }
     matrix.push(obj)             
     
 })
 return matrix
}
//###############################################################################
//################ Zeilen Manipulieren 
//###############################################################################
function AusgabeZeilenManipulieren( Spalte , tblID) {
    var input, filter, table, tr, td, i, txtValue;

        filter = 'rot'
        table = document.getElementById(tblID);
        tr = table.getElementsByTagName("tr");
        for (i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("td")[Spalte];
            //td = tr[i].getElementsByTagName("td");
                if (td) {
                    txtValue = td.textContent || td.innerText;
                    if (txtValue.indexOf(filter) > -1) {
                        console.log(td)
                        td.outerHTML = '<td class="'+ td.innerText+ '">'+ td.innerText+ '</td>';
                    }  
                }       
            }
    
}
//###############################################################################
//################ Farben in Spalte 
//###############################################################################
function TabelleSpalteinFarbe( Spalte , tblID) {
    var  filter, table, tr, td, i, txtValue;
    
    table = document.getElementById(tblID);
        tr = table.getElementsByTagName("tr");
        for (i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("td")[Spalte];
            //td = tr[i].getElementsByTagName("td");
                if (td) {
                    
                        td.outerHTML = '<td class="'+ td.innerText+ '">'+ td.innerText+ '</td>';

                }       
            }
    
}
//###############################################################################
//################ Spalten Ausblenden
//###############################################################################
function TabelleAusblenden( Spalten , tblID) {
    var   table, tr, td, i;
    
    table = document.getElementById(tblID);
        tr = table.getElementsByTagName("tr");
        th = table.getElementsByTagName("th");
        for (const Spalte of Spalten) 
            {
          
                th[Spalte].style.display = "none";
        for (i = 0; i < tr.length; i++) {
            
            td = tr[i].getElementsByTagName("td")[Spalte];

            if (td) {
                    td.style.display = "none";
                   }       
            }
        }
    
}


function ObjectToValue(result, Var, reinfolge) {
    let y = ""

    result.forEach(function(m, i) {
        for (eigenschaft in m) {
            if (reinfolge == "first") {
                console.log(i)
                if (Var == eigenschaft & i == 0) { y = m[eigenschaft]; }
            } else {
                if (Var == eigenschaft) { y = m[eigenschaft]; }
            }
        }

    })
    return y
}




function modalAbbruch(dlg) {
    $('#' + dlg).modal('hide');
    
}

function Tabellenausgeben(DatenAusgabe, AusgabeID ) {
    
    console.log(DatenAusgabe)
    // Find a <table> element with id="myTable":
    let table = document.getElementById(AusgabeID);

    // Create an empty <thead> element and add it to the table:
    let header = table.createTHead();
    let body = table.createTBody();

    DatenAusgabe.forEach(function (m, i) {
   
        if (i == 0) // ############# Überschrift ######### 
        {
            let row = header.insertRow();
            for (eigenschaft in m) {
                let cell = row.insertCell();
                let th = document.createElement("th");
                th.innerHTML = eigenschaft.replace(/_/i,' ')  ;
                cell.outerHTML = th.outerHTML;
            }
         }
        
                //################ Jede Zeile #################
        
            let row = body.insertRow();
            row.id = "tbl_" + i
            for (eigenschaft in m) {
                let cell = row.insertCell();
                cell.innerHTML = m[eigenschaft];

            }

        
    
    
    })

    tableSort(AusgabeID)
}



//###############################################################################
//################ Spalten Filter  #####
//###############################################################################
function Filter(myInput, Spalte, tblID) {
    //console.log(myInput, Spalte, tblID)
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById(myInput);
    if (input)
    {
        filter = input.value.toUpperCase();
        table = document.getElementById(tblID);
        tr = table.getElementsByTagName("tr");
        for (i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("td")[Spalte];
            //td = tr[i].getElementsByTagName("td");
                if (td) {
                    txtValue = td.textContent || td.innerText;
                    if (txtValue.toUpperCase().indexOf(filter) > -1) {
                        tr[i].style.display = "";
                    } else {
                        tr[i].style.display = "none";
                    }
                }       
            }
    }
}


//###############################################################################
//################  Download  #####
//###############################################################################
function CSVDownload()
{
let csv = '';



CSVResult.forEach(function (m, i) {
if (i == 0)
{
    for (eigenschaft in m) {
          
        csv += encodeURI(eigenschaft);
        csv += ";";

    }
    csv += "\n";  
}
for (eigenschaft in m) {
          
    csv += encodeURI(m[eigenschaft]).replace("#", " ");;
    csv += ";";
    console.log(encodeURI(m[eigenschaft]));

}
csv += "\n";  
console.log(csv.length);
})




let hiddenElement = document.createElement('a');
hiddenElement.href = 'data:text/csv;charset=utf-8,' + csv;
hiddenElement.target = '_blank';
hiddenElement.download = 'OpenOrders.csv';
hiddenElement.click();

}
//###############################################################################
//################  Sort  #####
//###############################################################################

function store_input_filter(content) {
    content = JSON.stringify(content);
    fetch('https://ppmesktech.poeppelmann.com/api_test/tbl_filter_write?content=' + content + '')
    .catch((error) => {
        console.error('Error:', error);
    });
}

async function read_input_filter() {
    try {
        const response = await fetch('https://ppmesktech.poeppelmann.com/api_test/tbl_filter_read');
        const data = await response.json();
        return data
    } catch (error) {
        console.error('Error:', error);
        return ''
    }
}

async function tableSort(Element) {
    filter = await read_input_filter();
    console.log(filter);
    tab = document.getElementById(Element);
    // Kopfzeile vorbereiten
    const initTableHead = function(sp) { 
        const sortbutton = document.createElement("button");
        sortbutton.type = "button";
        sortbutton.className = "sortbutton unsorted";
        sortbutton.addEventListener("click", function(e) { if(e.detail <= 1) tsort(sp); }, false);
        sortbutton.innerHTML = "<span class='visually-hidden'>" + sort_hint.asc + "</span>" 
                                                + "<span class='visually-hidden'>" + sort_hint.desc + "</span>" 
                                                + tabletitel[sp].innerHTML + sortsymbol;
        tabletitel[sp].innerHTML = "<span class='visually-hidden'>" + tabletitel[sp].innerHTML + "</span>";
        tabletitel[sp].appendChild(sortbutton);
        const suche = document.createElement("input")
        suche.className = 'form-control input-sm'
        suche.type = "text"
        suche.id = "suche_" + sp
        if (filter.table_column == sp){
            if (filter.column_value != '') {
                suche.value = filter.column_value.toString()
            }
        }
        // suche.value = x;
        // console.log(read_input_filter(sp));
        //suche.addEventListener("onkeyup", Filter("suche_" + sp,sp,'ausgabe') )
        suche.onkeyup = function(){ Filter("suche_" + sp, sp,'ausgabe') 
        input = document.getElementById("suche_" + sp);
        store_input_filter(input.value, sp);
        for (let i= 0;i<20;i++){
            input = document.getElementById("suche_" + i);
            if (input && i != sp)
                {
                    input.value = ''
                }
        }
    }
        tabletitel[sp].appendChild(suche);
        
        //<input type="text" id="myInput1" class="form-control" onkeyup="Filter('myInput1',1,'ausgabe')" placeholder="Search by Item No.">

        

        sortbuttons[sp] = sortbutton;
        tabletitel[sp].abbr = "";
    } // initTableHead

    // Tabellenfelder auslesen und auf Zahl oder String prüfen
    const getData = function (ele, col) { 
        const val = ele.textContent;
        // Tausendertrenner entfernen, und Komma durch Punkt ersetzen
        const tval = val.replace(/\s/g,"").replace(",", ".");
        if (!isNaN(tval) && tval.search(/[0-9]/) != -1) return tval; // Zahl
        sorttype[col] = "s"; // String
        return val;
    } // getData	

    // Vergleichsfunktion für Strings
    const vglFkt_s = function(a, b) { 
        return a[sorted].localeCompare(b[sorted],"de");
    } // vglFkt_s

    // Vergleichsfunktion für Zahlen
    const vglFkt_n = function(a, b) { 
        return a[sorted] - b[sorted];
    } // vglFkt_n

    // Der Sortierer
    const tsort = function(sp) { 
        if (sp == sorted) { // Tabelle ist schon nach dieser Spalte sortiert, also nur Reihenfolge umdrehen
            arr.reverse();
            sortbuttons[sp].classList.toggle("sortedasc"); 
            sortbuttons[sp].classList.toggle("sorteddesc"); 
            tabletitel[sp].abbr = (tabletitel[sp].abbr==sort_info.asc)?sort_info.desc:sort_info.asc;
        }
        else { // Sortieren 
            if (sorted > -1) {
                sortbuttons[sorted].classList.remove("sortedasc");
                sortbuttons[sorted].classList.remove("sorteddesc");
                sortbuttons[sorted].classList.add("unsorted");
                tabletitel[sorted].abbr = "";
            }
            sortbuttons[sp].classList.remove("unsorted");
            sortbuttons[sp].classList.add("sortedasc");
            sorted = sp;
            tabletitel[sp].abbr = sort_info.asc;
            if(sorttype[sp] == "n") arr.sort(vglFkt_n);
            else arr.sort(vglFkt_s);
        }	
        for (let r = 0; r < nrows; r++) tbdy.appendChild(arr[r][ncols]); // Sortierte Daten zurückschreiben
    } // tsort

    // Tabellenelemente ermitteln

    const tHead = tab.tHead;
    let tr_in_tHead, tabletitel;
    if (tHead) tr_in_tHead = tHead.rows;
    //console.log(tHead);
    if (tr_in_tHead) tabletitel = tr_in_tHead[0].cells;
    if ( !(tabletitel && tabletitel.length > 0) ) { 
        console.error("Tabelle hat keinen Kopf und/oder keine Kopfzellen."); 
        return; 
    }
    let tbdy = tab.tBodies;
    if ( !(tbdy) ) { 
        console.error("Tabelle hat keinen tbody.");
        return; 
    }
    tbdy = tbdy[0];
    const tr = tbdy.rows;
    if ( !(tr && tr.length > 0) ) { 
        console.error("Tabelle hat keine Zeilen im tbody."); 
        return; 
    }
    const nrows = tr.length,
        ncols = tr[0].cells.length;

    // Einige Variablen
    let arr = [],
        sorted = -1,
        sortbuttons = [],
        sorttype = [];

    // Hinweistexte
    const sort_info = {
        asc: "",
        desc: "",
    };
    const sort_hint = {
        asc: "",
        desc: "",
    };

    // Sortiersymbol
    const sortsymbol = '<svg role="img" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="-5 -5 190 110"><path  d="M0 0 L50 100 L100 0 Z" style="stroke:currentColor;fill:transparent;stroke-width:10;"/><path d="M80 100 L180 100 L130 0 Z" style="stroke:currentColor;fill:transparent;stroke-width:10;"/></svg>';

    // Stylesheets für Button im TH
    if(!document.getElementById("Stylesheet_tableSort")) {
        const sortbuttonStyle = document.createElement('style'); 
        const stylestring = '.sortbutton { width: 100%; height: 100%; border: none; background-color: transparent; font: inherit; color: inherit; text-align: inherit; padding: 0; cursor: pointer; } '	
        + '.sortierbar tHead th span.visually-hidden { position: absolute !important; clip: rect(1px, 1px, 1px, 1px) !important; padding: 0 !important; border: 0 !important; height: 1px !important; width: 1px !important; overflow: hidden !important; white-space: nowrap !important; } '
        + '.sortierbar caption span { font-weight: normal; font-size: .8em; } '
        + '.sortbutton svg { margin-left: .2em; height: .7em; } '
        + '.sortbutton.sortedasc svg path:last-of-type { fill: currentColor !important; } '
        + '.sortbutton.sorteddesc svg path:first-of-type { fill: currentColor!important; } '
        + '.sortbutton.sortedasc > span.visually-hidden:first-of-type { display: none; } '
        + '.sortbutton.sorteddesc > span.visually-hidden:last-of-type { display: none; } '
        + '.sortbutton.unsorted > span.visually-hidden:last-of-type { display: none; } ';
        sortbuttonStyle.innerText = stylestring;
        sortbuttonStyle.id = "Stylesheet_tableSort";
        document.head.appendChild(sortbuttonStyle);
    }

    // Kopfzeile vorbereiten
    for (let i = 0; i < tabletitel.length; i++) initTableHead(i);

    // Array mit Info, wie Spalte zu sortieren ist, vorbelegen
    for (let c = 0; c < ncols; c++) sorttype[c] = "n";

    // Tabelleninhalt in ein Array kopieren
    for (let r = 0; r < nrows; r++) {
        arr[r] = [];
        for (let c = 0, cc; c < ncols; c++) {
            cc = getData(tr[r].cells[c],c);
            arr[r][c] = cc;
            // tr[r].cells[c].innerHTML += "<br>"+cc+"<br>"+sorttype[c]; // zum Debuggen
        }
        arr[r][ncols] = tr[r];
    }

    // Tabelle die Klasse "is_sortable" geben
    tab.classList.add("is_sortable");

    // An caption Hinweis anhängen
    const caption = tab.caption;
    if(caption) caption.innerHTML += "<br><span>Ein Klick auf die Spaltenüberschrift sortiert die Tabelle.</span>";

    // Suche auslösen
    for (let i= 0;i<20;i++){
        input = document.getElementById("suche_" + i);
        if (input && input.value != '') {
            console.log(input.value)
            Filter("suche_" + i, i , 'ausgabe')
        }
    }

} // tableSort

//###########################################################################################################
//###########################################################################################################
//############################################zahlen_keypad##################################################
//###########################################################################################################
//###########################################################################################################


function zahlen_keypad(htmlFeld, Ueberschrift, Enter_function){
    $(htmlFeld).empty()
    $(htmlFeld).append($("<h3>"+Ueberschrift+"</h3>"));
    var inp = $("<input></input>")
    inp.addClass("form-control")
    inp.attr('type','numeric')
    //inp.attr('id','mengeneingabe')
    $(htmlFeld).append(inp);
    $(htmlFeld).append($("<br></br>"));
    for (let i = 1; i <= 9; i++) {
            var btn = $("<button></button>")
            btn.text(i );
            btn.addClass("btn btn-outline-secondary buttonHandeingabe")
            btn.click(function() {
                $(inp).val($(inp).val()+''+i)
            })
            $(htmlFeld).append(btn);
            if(i == 3||i == 6 || i == 9 )$(htmlFeld).append($("<br></br>"));
            
        } 
        
        var btn = $("<button></button>")
        btn.text('0' );
        btn.addClass("btn btn-outline-secondary buttonHandeingabe")
        btn.click(function() {
            $(inp).val($(inp).val()+'0')
        })
        $(htmlFeld).append(btn);
        
        var btn = $("<button></button>")
        btn.html('&#8656' ); //Back
        btn.addClass("btn btn-outline-secondary buttonHandeingabe")
        btn.click(function() {
            $(inp).val($(inp).val().substr(0,$(inp).val().length - 1))
            
        })
        $(htmlFeld).append(btn);
        
        var btn = $("<button></button>")
        btn.html('&#8634' ); // CLS
        btn.addClass("btn btn-outline-secondary buttonHandeingabe")
        btn.click(function() {
            $(inp).val('')
        })
        $(htmlFeld).append(btn);
        
        var btn = $("<button></button>")
        btn.html('&#8629' );//ENTER
        btn.addClass("btn btn-outline-secondary buttonHandeingabe")
        btn.click(function() {
            
            Enter_function( $(inp).val())
            
        })
        $(htmlFeld).append(btn);
}