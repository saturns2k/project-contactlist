window.onload = function (){
	console.log("connected")

	function contactsdisplay(data, catindex) //will be getting object of all contact list
	{
		data.forEach(function(contact){
			if (contact.category_id === catindex){
				var contactinfo = $('<div id="'+ contact.id +'">' +
					'<img src="'+ contact.picture + '" width = "200">' +
					'<br>' + contact.name + '<br>' +
					'age : ' + contact.age + '<br>' +
					'address : ' + contact.address + '<br>' +
					'phone : ' +  contact.phone_number + '<br>');

				var editbutton = $('<input type="button" value="edit">');
				var deletebutton = $('<input type="button" value="delete">');

				editbutton.click(function(){
					this.disabled = true;
					editcontact(contact.id, catindex);
				})

				deletebutton.click(function(){
					deletecontact(contact.id, catindex);
				})

				$(".contacts").append(contactinfo)
				$("#"+contact.id).append(editbutton).append(deletebutton).append('</div>');
			}
		});
	}

	function editcontact(id, catindex)
	{
		var inputname = $('<input id="inputname" placeholder = "name">');
		var inputage = $('<input id="inputage" placeholder = "age">');
		var inputaddress = $('<input id="inputaddress" placeholder = "address">');
		var inputphone = $('<input id="inputphone" placeholder = "phone number">');
		var inputsubmit = $('<button> submit </button>');
		var inputchangecat = $('<select id="inputcat"></select>');
		inputchangecat.append('<option value="">Select A Category...</option>')

		$.ajax({ url: '/categories' , type: 'GET'}).done(function(data){
			data.forEach(function(catoption){
				var choice = $('<option id="'+catoption["id"]+'">'+catoption["name"]+'</option>');
				$('#inputcat').append(choice);			
			});
		});

		inputchangecat.change(function(){
			var selectedcatid = $("#inputcat option:selected")[0].id;
			var editcontact = {category_id: selectedcatid};

			$.ajax({ url: '/contacts/'+id, type: 'PUT', data: editcontact}).done(function(){
				// repetition ajax 4
				$.ajax({ url: '/contacts' , type: 'GET'}).done(function(data){
					$(".contacts").empty();
					contactsdisplay(data, catindex);
					contactsadd(catindex);
				});
			});
		});


		inputsubmit.click(function(){
			// error trapping conditional
			if (inputname.val() != "" && typeof(parseInt(inputage.val())) === "number"
				&& inputaddress.val() != "" && inputphone.val() != ""){
				var editcontact = {name: inputname.val(), age: parseInt(inputage.val()), 
					address: inputaddress.val(), phone_number: inputphone.val()};
				
				$.ajax({ url: '/contacts/'+id, type: 'PUT', data: editcontact}).done(function(){
					// repetition ajax 3
					$.ajax({ url: '/contacts' , type: 'GET'}).done(function(data){
						$(".contacts").empty();
						contactsdisplay(data, catindex);
						contactsadd(catindex);
					});
				});
			}
			else {
				$('#errormessage').remove();
				$('#'+id).append('<p id="errormessage">Correct your edit field and try again<p>');
			}

		});
		$('#'+id).append('<br>').append(inputname).append(inputage).append(inputaddress).append(inputphone);
		$('#'+id).append(inputsubmit).append('<br>Change Catagory  ').append(inputchangecat);
	}

	function deletecontact(id, catindex)
	{
		$.ajax({ url: '/contacts/'+id, type: 'DELETE'}).done(function(){
			// repetition ajax 5
			$.ajax({ url: '/contacts' , type: 'GET'}).done(function(data){
				$(".contacts").empty();
				contactsdisplay(data, catindex);
				contactsadd(catindex);
			});
		});
	}

	function contactsadd(catindex)
	{
		var inputname = $('<input id="inputname" placeholder = "name">');
		var inputage = $('<input id="inputage" placeholder = "age">');
		var inputaddress = $('<input id="inputaddress" placeholder = "address">');
		var inputphone = $('<input id="inputphone" placeholder = "phone number">');
		var inputsubmit = $('<button> submit </button>');
		$(".contacts").append('<br><label>Add New Contact</label><br>').append(inputname).append(inputage).append(inputaddress).append(inputphone).append(inputsubmit);
		inputsubmit.click(function(){
			if (inputname.val() != "" && typeof(parseInt(inputage.val())) === "number"
				&& inputaddress.val() != "" && inputphone.val() != ""){
				$.ajax({ url: 'http://api.randomuser.me/', dataType: 'json'}).done(function(picdata){
					var randompic = picdata.results[0].user.picture.large;
					var newcontact = {name: inputname.val(), age: parseInt(inputage.val()), 
						address: inputaddress.val(), phone_number: inputphone.val(), picture: randompic, category_id: catindex};

					$.ajax({ url: '/contacts', type: 'POST', data: newcontact}).done(function(){
						// repetition ajax call 1
						$.ajax({ url: '/contacts' , type: 'GET'}).done(function(data){
							$(".contacts").empty();
							contactsdisplay(data, catindex);
							contactsadd(catindex);
						});
					});
				});
			}
			else {
				$('#errormessage').remove();
				$('.contacts').append('<p id="errormessage">Correct your edit field and try again<p>');
			}
		});
	}



	$.ajax({ url: '/categories' , type: 'GET'}).done(function(data){
		data.forEach(function(catdata){
			console.log(catdata);
			var catname = $('<h3>'+catdata.name+'</h3>');
			var catviewbutton = $('<input type=button value="View Contact">');
			catviewbutton.click(function(){
				// repetition ajax call 2
				$.ajax({ url: '/contacts' , type: 'GET'}).done(function(data){
					$(".contacts").empty();
					contactsdisplay(data, catdata.id);
					contactsadd(catdata.id);
				});
			});
			$(".category").append(catname).append(catviewbutton);
		});
		$(".category").append('<br><br><br>')
	});

// # CREATE TABLE categories(
// #   id serial primary key,
// #   name varchar(255)
// # );

// # CREATE TABLE contacts(
// #   id serial primary key,
// #   name varchar(255),
// #   age integer,
// #   address varchar(255),
// #   phone_number varchar(255),
// #   picture text,
// #   category_id integer
// # );

	$('.search').find('button').click(function(){
		var searchkey = $('.search').find('input').val();
		$.ajax({ url: '/contacts' , type: 'GET'}).done(function(data){
			$(".contacts").empty();
			data.forEach(function(contactdata){
				if (contactdata.name.toLowerCase().search(searchkey) > -1)
				{
					contactsdisplay([contactdata], contactdata.category_id);
				}
			});
		});
	});





























}
