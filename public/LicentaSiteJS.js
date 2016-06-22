


$(document).ready(function()
{
	//nu merge cu clase, doar id-uri
	$("#animetab").mouseenter(function()
	{
		$("#animetab").fadeTo("fast",0.5);
		$("#animetab").fadeTo("fast",1);
	});
	$("#rectab").mouseenter(function()
	{
		$("#rectab").fadeTo("fast",0.5);
		$("#rectab").fadeTo("fast",1);
	});
	$("#forumtab").mouseenter(function()
	{
		$("#forumtab").fadeTo("fast",0.5);
		$("#forumtab").fadeTo("fast",1);
	});
	$("#log_in").mouseenter(function()
	{
		$("#log_in").fadeTo("fast",0.5);
		$("#log_in").fadeTo("fast",1);
	});
	$("#sign_up").mouseenter(function()
	{
		$("#sign_up").fadeTo("fast",0.5);
		$("#sign_up").fadeTo("fast",1);
	});
//.delay(200).fadeIn();


	//change background image every 3000ms / 3 seconds

	var imgId = 0;
	var myVar = setInterval(function()
	{ //schimbat imagine la cateva secunde

		var list = ["/images/city1.jpg","/images/city2.jpg","/images/city3.jpg","/images/scenicanime.jpeg"];
		imgId++;
		if(imgId > 3) {
			imgId = 0;
		}

		$("#topimage").fadeTo("slow",0,function() //pentru a putea merge in ordinea corecta, am inclus attr in fadeTo
    {
      $("#topimage").attr('src', list[imgId]);//inverseaza ordinea intre fadeTo(slow,0) si document.getElementById().src = ...
                                              //deoarece avem jquerry + javascript amestecate
    });
		$("#topimage").fadeTo("slow",1);
	},1000*5); //5 secunde
  
	function clearFiels(){
		document.getElementById("login_form").reset();
		document.getElementById("signup_form").reset();
  	}
  
});


