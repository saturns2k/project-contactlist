window.onload = function (){
	console.log("connected")

	function contactsdisplay(data, catindex) //will be getting object of all contact list
	{
		data.forEach(function(contact){
			if (contact.category_id === catindex){
				var contactinfo = $('<div id="'+ contact.id +'" class="row">' +
					'<div class="col-md-4" id="picfield">' + 
					'<img src="'+ contact.picture + '" width = "200" class="img-rounded"></div>' +
					'<div class="col-md-4" id="datafield">' +
					'<br><h4>' + contact.name + '</h4><br>' +
					'<p>age : ' + contact.age + '<br>' +
					'address : ' + contact.address + '<br>' +
					'phone : ' +  contact.phone_number + '<p><br></div>');

				var editbutton = $('<input type="button" class="btn btn-primary" id = "edit" value="edit">');
				var deletebutton = $('<input type="button" class="btn btn-primary" value="delete">');

				editbutton.click(function(){
					$("#editfield").parent().remove();
					editcontact(contact, catindex);
				})

				deletebutton.click(function(){
					deletecontact(contact.id, catindex);
				})

				$(".contacts").append(contactinfo)
				$("#"+contact.id).find("#datafield").append(editbutton).append(deletebutton);
				$("#"+contact.id).append("</div>")
			}
		});
	}

	function editcontact(memdata, catindex)
	{
		var inputbinderform = $('<form class="form-inline" role="form"></form>');
		var inputbinderdiv = $('<div id="editfield" class="col-md-3"></div>');
		var inputname = $('<input class="form-control input-sm" value = "'+memdata.name+'" placeholder = "name">');
		var inputage = $('<input class="form-control input-sm" value = "'+memdata.age+'" placeholder = "age">');
		var inputaddress = $('<input class="form-control input-sm" value = "'+memdata.address+'" placeholder = "address">');
		var inputphone = $('<input class="form-control input-sm" value = "'+memdata.phone_number+'" placeholder = "phone number">');
		var inputsubmit = $('<button class="btn btn-default btn-sm"> submit </button>');
		var inputchangecat = $('<select id="inputcat" class="form-control input-sm"></select>');
		inputchangecat.append('<option value="">Change Category...</option>')

		$.ajax({ url: '/categories' , type: 'GET'}).done(function(data){
			data.forEach(function(catoption){
				var choice = $('<option id="'+catoption["id"]+'">'+catoption["name"]+'</option>');
				$('#'+memdata.id).find('#inputcat').append(choice);			
			});
		});

		inputchangecat.change(function(){
			var selectedcatid = $("#inputcat option:selected")[0].id;
			var editcontact = {category_id: selectedcatid};

			$.ajax({ url: '/contacts/'+memdata.id, type: 'PUT', data: editcontact}).done(function(){
				// repetition ajax 4
				$.ajax({ url: '/contacts' , type: 'GET'}).done(function(data){
					$(".contacts").empty();
					contactsdisplay(data, catindex);
					contactsadd(catindex);
				});
			});
		});


		inputsubmit.click(function(e){
			e.preventDefault();
			// error trapping conditional
			if (inputname.val() != "" && !isNaN(inputage.val())
				&& inputaddress.val() != "" && inputphone.val() != ""){
				var editcontact = {name: inputname.val(), age: parseInt(inputage.val()), 
					address: inputaddress.val(), phone_number: inputphone.val()};
				
				$.ajax({ url: '/contacts/'+memdata.id, type: 'PUT', data: editcontact}).done(function(){
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
				inputbinderdiv.append('<h5 id="errormessage">Correct your edit field and try again</h5>');
				$('#editfield').addClass('has-error')
			}

		});
		inputbinderdiv.append('<br>').append(inputname).append(inputage).append(inputaddress).append(inputphone);
		inputbinderdiv.append(inputsubmit).append(inputchangecat);
		inputbinderform.append(inputbinderdiv)
		$('#'+memdata.id).append(inputbinderform)
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
		var inputbinderform = $('<form id = "addbinder" class="form-inline" role="form"></form>');
		var inputbinderdiv = $('<div class="form-group"></div>')
		var inputname = $('<input class="form-control" id="inputname" placeholder = "name">');
		var inputage = $('<input class="form-control" id="inputage" placeholder = "age">');
		var inputaddress = $('<input class="form-control" id="inputaddress" placeholder = "address">');
		var inputphone = $('<input class="form-control" id="inputphone" placeholder = "phone number">');
		var inputsubmit = $('<button class="btn btn-default">submit</button>');
		inputbinderdiv.append('<br><label>Add New Contact</label><br>').append(inputname).append(inputage).append(inputaddress).append(inputphone).append(inputsubmit);
		inputbinderform.append(inputbinderdiv)
		$(".contacts").append(inputbinderform);
		inputsubmit.click(function(e){
			e.preventDefault();
			if (inputname.val() != "" && !isNaN(inputage.val())
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
				$('.contacts').append('<h5 id="errormessage">Correct your add field and try again<h5>');
				$('#addbinder').children().addClass('has-error');
			}
		});
	}



	$.ajax({ url: '/categories' , type: 'GET'}).done(function(data){
		data.forEach(function(catdata){
			console.log(catdata);
			var catname = $('<h3>'+catdata.name+'</h3>');
			var catviewbutton = $('<input type=button class="btn btn-default" value="View Contact">');
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

	$('.search').find('button').click(function(e){
		e.preventDefault();
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

}
