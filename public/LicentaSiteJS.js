


$(document).ready(function()
{
	/*
	function msg() {
		var r = confirm("Are you sure you want to log out?");
		if (r == true) {
			x = "Logging out!";
			//de intors inapoi la pagina principala

		}
	}
		<form action="">
		<input type="checkbox" name="remember" value="checker">Remember this choice
		</form>*/

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

		var list = ["images/city1.jpg","images/city2.jpg","images/city3.jpg","images/scenicanime.jpeg"];
		imgId++;
		if(imgId > 3) {
			imgId = 0;
		}

		$("#topimage").fadeTo("slow",0,function()
    { //inverseaza ordinea intre fadeTo(slow,0) si document.getElementById().src = ...
      $("#topimage").attr('src', list[imgId]);//nimic nou
    });
		$("#topimage").fadeTo("slow",1);
	},3000);


	/*
	$("#log_in").on("click",function() //login checks
	{
		var Username = document.getElementById("username").value;
		var Password = document.getElementById("password").value;
		if(Username.length > 0 && Password.length > 0)
		{
			window.location.assign(".html");//trebuie sa fie dus la pagina curenta
		}else{
			alert("No user or password was inserted !");
		}
	});*/ //inlocuit the parametrul required din <input>

	/*$(".submit_button_New").on("click",function() //signup checks
	{
		console.log("check has been initiated")

		var New_Username = document.getElementById("new_username").value;
		var New_Password = document.getElementById("new_password").value;
		var New_Password2 = document.getElementById("password2").value;

		console.log("values from input" , New_Username, New_Password);
		if(New_Username.length > 0 && New_Password.length > 0 && New_Password2.length > 0)
		{

			//mai trebuie un if sa verifice daca username-ul nu e luat deja

			if (!New_Username.match(/[a-zA-Z0-9_/-]/))
			{
				alert("Userame not valid !");
			}if (New_Username.length < 8)
			{
				alert("Username too short !");
			}
			if (!New_Password.match(/[a-zA-Z0-9]/))
			{
				alert("Password not valid !");
			}
			if (New_Password.length <= 7)
			{
				alert("Password too short !");
			}
			if (New_Password !== New_Password2)
			{
				alert("Passwords don't match !");
			}

			document.getElementById("signup_form").submit();

		}else{
			alert("Not all fields have been filled !");
		}
	});*/ //inlocuit de parametrii min si pattern din <input>

	function clearFiels(){
		document.getElementById("login_form").reset();
		document.getElementById("signup_form").reset();
  	}

});


