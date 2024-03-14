from flask import Flask, request, render_template, jsonify
import json
import sqlalchemy as sa
import urllib
import pandas as pd
from datetime import datetime
import phonenumbers

app = Flask(__name__)

params = urllib.parse.quote_plus("DRIVER={ODBC Driver 17 for SQL Server};"
                                 "SERVER=PPDESQLAPP4.ppdom01.poeppelmann.com;"
                                 "DATABASE=PPTelefonbuch;"
								"UID=pptelefonbuch_ppdedocker1;"
								"PWD=aohi56bfglkdfgjJfdsdf#")


engine = sa.create_engine("mssql+pyodbc:///?odbc_connect={}".format(params))


#############################################################################################################
################################################ LOG
#############################################################################################################

def log__(value):
    try:
        
        
        x = open(  'src/log/log_'+str(datetime.now().strftime("%Y%m%d"))+'.txt', mode='a', encoding="utf-8")
        x.write( str(datetime.now().strftime("%Y-%m-%d %H:%M:%S")) + ' - ' + value+'\n')
        x.close
        return True
    except:
        return False

@app.route('/')
def index():
    return render_template('index_sql.html')

@app.route('/sqlsearch', methods=['POST'])
def sqlsearch():
    try:
        query = request.get_json().get('query')
        user = ''
        if "Ppauthentication" in request.headers:
            user = request.headers["Ppauthentication"]
        log__(f'User: {user} - Abfrage: {query}')
        hallensuche = 'halle'
    
        sql = """SELECT 
                isnull([ID],'')[ID] 
                , isnull([displayName], '')[displayName]
                , isnull([givenName],'')[givenName]
                , isnull([sn],'')[sn]
                , isnull([company],'')[company]
                , concat(isnull([department],''), ' ', abteilung_kurz) [department]
                , isnull([email],'')[email]
                , isnull([place],'')[place]
                , isnull([businessID],'')[businessID]
                , isnull([telephoneNumber],'')[telephoneNumber]
                , isnull([mobile],'')[mobile]
                , isnull([quelle],'')[quelle]
                from T001_Gesamt WITH (NOLOCK) WHERE quelle = 'AD' AND 
                    (displayName like '%' + ? + '%' OR email like '%' + ? + '%' 
                    OR company like '%' + ? + '%' OR department like '%' + ? + '%' 
                    OR mobile like '%' + ? + '%' OR place like '%' + ? + '%' 
                    OR telephoneNumber like '%' + ? + '%'
                    OR abteilung_kurz like  ? + '%'
                    
                    )"""
        if hallensuche not in query:
            sql += "ORDER BY displayName" 
        else:
            sql += "ORDER BY displayName"
        
        result = pd.read_sql(sql, engine, params=(query, query, query, query, query, query, query, query))
        # new_result = []
        # for i in result.to_dict('records'):
        #     try:
        #         i["telephoneNumber"] = phonenumbers.format_number(phonenumbers.parse(i["telephoneNumber"], None), phonenumbers.PhoneNumberFormat.INTERNATIONAL)
        #     except:
        #         pass
        #     new_result.append(i)
        return json.dumps(result.to_dict('records'))


            
    except Exception as e:
        print("Something went wrong:", e)
        return json.dumps([])


@app.route('/sqlsearch_extern', methods=['POST'])
def sqlsearch_extern():

    try:
         user = ''
         query = request.get_json().get('query')
         if "Ppauthentication" in request.headers:
             user = request.headers["Ppauthentication"]
         log__(f'User: {user} - Abfrage: {query}')
         hallensuche = 'halle'


         sql = """SELECT Top 100
                    isnull([ID],'')[ID] 
                    , isnull([displayName], '')[displayName]
                    , isnull([givenName],'')[givenName]
                    , isnull([sn],'')[sn]
                    , isnull([company],'')[company]
                    , concat(isnull([department],''), ' ', abteilung_kurz) [department]
                    , isnull([email],'')[email]
                    , isnull([place],'')[place]
                    , isnull([businessID],'')[businessID]
                    , isnull([telephoneNumber],'')[telephoneNumber]
                    , isnull([mobile],'')[mobile]
                    , isnull([quelle],'')[quelle]
                    from T001_Gesamt WITH (NOLOCK) WHERE
                        displayName like '%' + ? + '%' OR email like '%' + ? + '%' 
                        OR company like '%' + ? + '%' OR department like '%' + ? + '%' 
                        OR mobile like '%' + ? + '%' OR place like '%' + ? + '%' 
                        OR telephoneNumber like '%' + ? + '%'
                        OR abteilung_kurz like  ? + '%'
                        """ 
         if hallensuche not in query:
            sql += "ORDER BY displayName" 
         else:
            sql += "ORDER BY displayName"


         result = pd.read_sql(sql, engine, params=(query, query, query, query, query, query, query, query))
         return json.dumps(result.to_dict('records'))
   
      

            
    except Exception as e:
        print("Something went wrong:", e)
        return json.dumps([])

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=False)



