
//MQTT-välityspalvelimen määrittely
const mqtt    = require('mqtt');
const broker = 'mqtt://test.mosquitto.org';
const user = '';
const pw = ''; 

//määritellään välityspalvelimen "olio"
mq = mqtt.connect(broker, {
  'username': user,
  'password': pw
});

//tilataan oikea topic
mq.subscribe('automaatio/#');

//liitytään välityspalvelimeen
mq.on('connect', function(){
    console.log('Connected.....');
});

//Määritellään tietokanta-API
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://Arash:alettaalexandra@cluster0.aaeg7v9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Lisää tämä MongoClient-instanssin jälkeen, ennen kuin käytät client.db()
client.connect((err) => {
  if (err) {
    console.error("Failed to connect to MongoDB:", err);
  } else {
    console.log("Connected to MongoDB");
  }
});

//määritellään tietokannan ja kokoelman nimi sekä dataobjekti sensoridatan käsittelyyn
const myDB = client.db("sensordata2");
const myColl = myDB.collection("sensordata2");
var obj;

//odotetaan dataa välityspalvelimelta ja viedään data tietokantaan
mq.on('message', function(topic, message) {
  console.log(message.toString('utf8'));
  obj = JSON.parse(message);
  console.log(obj.Time, obj.T, obj.H, obj.DP, obj.pCount);
	myColl.insertOne(obj);
	console.log(
	`An entry was inserted successfully`,
	);
});





