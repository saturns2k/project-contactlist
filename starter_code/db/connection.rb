require 'active_record'

ActiveRecord::Base.establish_connection({
  :adapter => "postgresql",
  :host     => "localhost",
  :username => "saturns2k",
  :database => "contactlist"
})

ActiveRecord::Base.logger = Logger.new(STDOUT)
