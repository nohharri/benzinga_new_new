var global_name = "";
var person;
var nameChosen = false;
var stockOpen = false;
var isStock = false;
var stockbid = 0;
var stockask = 0;
var stocksymbol = "";

function Person(name)
{
  this.name = name;
  this.money = 100000;
  this.stocksOwned = 0;
  this.stocks = {};
}

function fadeFunc()
{
     document.body.style.backgroundColor = "#eee";
}

function nameSubmit()
{
  var name = document.getElementById('nameInputID').value;

  if(name == "")
   alert("Please fill in a name.");
  else
  {
    nameChosen = true;
    global_name = name;
    person = new Person(global_name);
    fadeSuccess();
  }
}

function fadeSuccess()
{
  $( "#information" ).animate({
    opacity: 0,
    left: "+=50",
  }, 200, function() {
    //has finished fading
    var myNode = document.getElementById("information");
    while (myNode.firstChild) 
    {
      myNode.removeChild(myNode.firstChild);
    }
      $("#information").append("<img style='margin:10 40;' id='benzingaimg' src='static/images/benzingaperson.png' width=300px/>");
      $("#information").append("<center><b><p id='name_show' style='font-size:50px; '></p></b></center>");
      if(global_name.length > 15)
      {
        var temp_name = "";
        for(i = 0; i < 15; i++)
        {
          temp_name += global_name[i];
        }
        temp_name += "...";
        document.getElementById("name_show").innerHTML = temp_name;
      }
      else
      {
        document.getElementById("name_show").innerHTML = global_name;
      }
      
      setTimeout(function(){
      odometer.innerHTML = 100000;
      }, 1000);
      
      $( "#information" ).animate({
    opacity: 1.0,
    left: "+=50",
  }, 200, function() {
    //has finished fading
  });
  });
}

  stockname = document.getElementById('stockInputID').value;

function stockSubmit()
{
  var stockname = document.getElementById('searchID').value;
  if(nameChosen == false)
  {
    alert("Please enter your name.");
    return;
  }
  if(stockOpen == true)
  {
    deleteStockSubmit();
    stockOpen = false;
  }
  if(stockOpen == false)
  {
      getStock(stockname);
      stockOpen = true;
      if(isStock == true)
      {
        $('#stockDisplay').append("<div id='stockX' style='background-color: #FAAF46; margin-top:10px;margin-bottom:10px;border-radius:10px;font-size:20px;padding-left:10px;'></div>");
        var output = stockname + " bid: " + stockbid + " ask: " + stockask;
        $('#stockX').append(output);
        $('#stockX').append("<span style='float:right; padding-right:10px;' onclick='deleteStockSubmit()'><b>x</b></span>");
      }
      else
      {
        $('#stockDisplay').append("<div id='stockX' style='background-color: #F75F48; margin-top:10px;margin-bottom:10px;border-radius:10px;font-size             :20px;padding-left:10px;'>Please enter a valid stock name.</div>");
        $('#stockX').append("<span style='float:right; padding-right:10px;' onclick='deleteStockSubmit()'><b>x</b></span>");
      }
  }
}

function deleteStockSubmit()
{
  stockOpen = false;
  $('#stockX').remove();
}



function getStock(stock)
{
		var url = "http://data.benzinga.com/stock/" + stock;
		$.ajax({
			'url' : url, //URL
			'type' : 'GET',
			'data' : {                                  //Input data
				'anyName' : 'anyValue'
			},
			'success' : function(data) 
			{       
				if(data.status != 'error')
				{
				  isStock = true;
				  stockbid = data.bid;
				  stockask = data.ask;
				  stocksymbol = data.symbol;
                                }   
                                else
                                  isStock = false;  
			},
			'error' : function(request,error)            //Fail callback
			{
				alert("ajax call error");
			}
		});
}

function buyAttempt()
{
  var quantity = prompt("How much do you want?", 0);
  if(quantity <= 0)
  {
    alert("That is an illegal amount.");
    return;
  }
  var true_amount = quantity * stockask;
  if(person.money - true_amount >= 0)
  {
    person.money -= true_amount;
    if(stocksymbol in person.stocks)
    {
      person.stocks[stocksymbol].quantity += parseInt(quantity);
      var stockID = "stock" + person.stocks[stocksymbol].symbol;
      var stock_entry = "<div id='stock" + person.stocks[stocksymbol].symbol + "'>" + person.stocks[stocksymbol].quantity + " stocks of " + person.stocks[stocksymbol].symbol + "</div>";
      document.getElementById(stockID).innerHTML = stock_entry;
    }
    else
    {
      person.stocks[stocksymbol] = { quantity: parseInt(quantity), symbol: stocksymbol };
      var stock_entry = "<div id='stock" + person.stocks[stocksymbol].symbol + "'>" + parseInt(person.stocks[stocksymbol].quantity) + " stocks of " + person.stocks[stocksymbol].symbol + "</div>"
      $('#stocksBought').append(stock_entry);
    }
    
    setTimeout(function(){
      odometer.innerHTML = person.money;
      }, 1000);
  }
  else
     alert("You have insufficient funds to make such purchase.");
}

function sellAttempt()
{
   var quantity = prompt("How many quantities do you want to sell?",0);
   if(!(stocksymbol in person.stocks))
   {
     alert("Stock not found!");
     return;
   }
   if(quantity <= 0 || parseInt(quantity) > parseInt(person.stocks[stocksymbol].quantity))
   {
     alert("That is an illegal amount.");
     return;
   }
      person.stocks[stocksymbol].quantity -= parseInt(quantity);
      var true_amount = quantity * stockbid;
      person.money += true_amount;
      setTimeout(function(){
      odometer.innerHTML = person.money;
      }, 1000);
      var soldStockID = "stock" + person.stocks[stocksymbol].symbol;
      if(person.stocks[stocksymbol].quantity == 0)
      {
        var soldstockIDthing = '#' + soldStockID;
        $(soldstockIDthing).remove();
      }
      else
      {
        var stock_entry = "<div id='stock" + person.stocks[stocksymbol].symbol + "'>" + person.stocks[stocksymbol].quantity + " stocks of " + person.stocks[stocksymbol].symbol + "</div>";
        document.getElementById(soldStockID).innerHTML = stock_entry;
      }
}