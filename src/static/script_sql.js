function sqlsearch(url){
    let value = input_replace()
    $.ajax({
      url: url,
      type: "POST",
      dataType: 'json',
      headers: { 'Content-Type': 'application/json'},
      data: JSON.stringify({
          query: value
      }),
      success: function(results){

          $('#searchResults').empty();
          if (results.length === 0) {
              $('#searchResults').html('<div>Keine Ergebnisse gefunden</div>');
          } else {
              results.forEach(element => {
                  const jsonString = JSON.stringify(element, null, 2); // "2" fügt Einrückung hinzu
                  const jsonObject = JSON.parse(jsonString);
                //   console.log("query");

                let tblanzicht = false
                if (tblanzicht == true){

                    Tabellenausgeben(results, "searchResults-liste")

                }
                else
                {

                    let logo = ''

                    if (jsonObject.quelle == 'AD'){logo = '<img src="static/img/poeppelmann_logo.jpg" alt="logo Icon" width="10%" height="10%" div style="margin-top:4%;margin-right:2%;box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.2);">'}
                    let card = $("<div></div>").addClass("profile-card").attr("id", "profile-card");
                    let search_container = $("<div></div>").attr("id","search-container")


                    let cn = $("<div></div>").html(logo+jsonObject.displayName).attr('id','profile-name').addClass("profile-name text-dark")

                    let department = ''
                    if (jsonObject.department != '') department = $("<div></div>").html('<img class="imgthumb" src="static/img/department.png" alt="logo Icon" width="15px" height="15px">'+jsonObject.department).attr('id','profile-department').addClass("profile-department text-dark")

                    let company = ''
                    if (jsonObject.company != '') company = $("<div></div>").html('<img class="imgthumb" src="static/img/company.png" alt="logo Icon" width="15px" height="15px">'+jsonObject.company).attr('id','profile-company').addClass("profile-company text-dark")
                    

                    let mail = ''
                    if (jsonObject.email != '')
                    {
                        mail = $("<div></div>").html('<a href="mailto:'+jsonObject.email+'"><img class="imgthumb" src="static/img/email.png" alt="logo Icon" width="15px" height="15px">'+jsonObject.email+'</a>').attr('id','profile-company').addClass("profile-mail text-dark")
                        let mail_btn = $("<button></button>").addClass("copy-button").click(function() {copyToClipboard(jsonObject.email)}).html('<img class="imgthumb" src="static/img/copy.png" alt="mobile Icon" width="15px" height="15px">')
                        mail.append(mail_btn)
                    }



                    let telephoneNumber = ''
                    if (jsonObject.telephoneNumber != '') {
                        telephoneNumber= $("<div></div>").html('<a href="https://teams.microsoft.com/l/chat/0/0?users='+jsonObject.email+'" target="_blank"><img class="imgthumb" src="static/img/telefon.jpg" alt="logo Icon" width="15px" height="15px">'+jsonObject.telephoneNumber+'</a>').attr('id','profile-company').addClass("profile-mail text-dark")
                        let telephoneNumber_btn = $("<button></button>").addClass("copy-button").click(function() {copyToClipboard(jsonObject.telephoneNumber)}).html('<img class="imgthumb" src="static/img/copy.png" alt="mobile Icon" width="15px" height="15px">')
                        telephoneNumber.append(telephoneNumber_btn)
                    }
                    let mobile = ''
                    if (jsonObject.mobile != '')
                    {
                        mobile = $("<div></div>").html('<a href="https://teams.microsoft.com/l/chat/0/0?users='+jsonObject.email+'" target="_blank"><img class="imgthumb" src="static/img/telefon.png" alt="logo Icon" width="15px" height="15px">'+jsonObject.mobile+'</a>').attr('id','profile-company').addClass("profile-mail text-dark")
                        let mobile_btn = $("<button></button>").addClass("copy-button").click(function() {copyToClipboard(jsonObject.mobile)}).html('<img class="imgthumb" src="static/img/copy.png" alt="mobile Icon" width="15px" height="15px">')
                        mobile.append(mobile_btn)
                    }

                    let place = ''
                    if (jsonObject.place != '') place = $("<div></div>").html('<img class="imgthumb" src="static/img/department.png" alt="logo Icon" width="15px" height="15px">'+jsonObject.place).attr('id','profile-office').addClass("profile-office text-dark")

                    


                    $('#searchResults').append(
                    card.append(
                        search_container.append(
                              cn,
                                department,
                                company,
                                mail,
                                telephoneNumber,
                                mobile,
                                place,
                          )
                    )
                      
                  );

                  }


              });
          }
      }
  });
}


function copyToClipboard(text) {
    var textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    // alert("Kopiert: " + text);
}

var switchStatus = false;

function toggleFunction() {
    var switchButton = document.getElementById("checkbox");

    switchStatus = switchButton.checked;
    suche()
}

document.querySelector('.search-input').addEventListener('keyup', function(event) {

    if (event.key === 'Enter') {
        e.preventDefault();
        console.log("Enter gedrückt")
    }
      
            if ($('#v').val().length > 2 )  
            {     
                console.log("length = " , $('#v').val().length)

                if ($('#v').val().toLowerCase().includes("hall")){

                    if ($('#v').val().length > 6 ) suche()
                }
                else{               
                    suche()
                }
            }else { $('#searchResults').empty();}
       
        
});



function suche(){
    if ($('#v').val() == '')
    {
        $('#searchResults').empty();
    }
    else
    {
        switch (switchStatus) {
            case true:
                    sqlsearch("/sqlsearch_extern");   
                    
            break;
            case false:
                    sqlsearch("/sqlsearch");   
        }
    }
}


function input_replace(){
    let x = $('#v').val()
    x = x.toLowerCase()

    if (x.length == 7)  x = x.replace('halle 1', 'halle 01')
    if (x.length == 7)  x = x.replace('halle 2', 'halle 02')
    if (x.length == 7)  x = x.replace('halle 3', 'halle 03')
    if (x.length == 7)  x = x.replace('halle 4', 'halle 04')
    if (x.length == 7)  x = x.replace('halle 5', 'halle 05')
    if (x.length == 7)  x = x.replace('halle 6', 'halle 06')
    if (x.length == 7)  x = x.replace('halle 7', 'halle 07')
    if (x.length == 7)  x = x.replace('halle 8', 'halle 08')
    if (x.length == 7)  x = x.replace('halle 9', 'halle 09')
    if (x.length == 6)  x = x.replace('devops', 'it development and operation')
    if (x.length == 3)  x = x.replace('tus', 'technik und service')
    if (x.length == 4)  x = x.replace('olga', 'Natalie Wolinska')
    

    console.log(x)
return x
}