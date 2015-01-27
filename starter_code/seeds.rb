require 'pry'
require_relative './db/connection'
require_relative './lib/category'
require_relative './lib/contact'

Category.delete_all
Contact.delete_all

friends = Category.create(name: "friends")
frenemies = Category.create(name: "frenemies")
rebels = Category.create(name: "rebels")

Contact.create(name: "Fritz", age: 24, address: "1234 Andrew Street", phone_number: "917-111-2222", picture: "http://i.imgur.com/PJE2D.png", category_id: friends.id)
Contact.create(name: "Jeff", age: 26, address: "2345 Konowitch Street", phone_number: "201-222-3333", picture: "http://media.tumblr.com/tumblr_lzgq4uXiEu1qbbwtc.png", category_id: friends.id)
Contact.create(name: "Neel", age: 27, address: "3456 Patel Street", phone_number: "444-444-5555", picture: "http://blogs.citypages.com/dressingroom/Super-Mario-3DS-nintendo-img1.jpg",category_id: friends.id)
Contact.create(name: "Sith Lord", age: 104, address: "3458 Tatooine Avenue", phone_number: "567-237-2374", picture: "http://img1.wikia.nocookie.net/__cb20120120180946/es.starwars/images/2/27/DarthMaul-SWI122.jpg", category_id: frenemies.id)


# CREATE TABLE categories(
#   id serial primary key,
#   name varchar(255)
# );

# CREATE TABLE contacts(
#   id serial primary key,
#   name varchar(255),
#   age integer,
#   address varchar(255),
#   phone_number varchar(255),
#   picture text,
#   category_id integer
# );
