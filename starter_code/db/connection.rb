require 'active_record'

ActiveRecord::Base.establish_connection({
  :adapter => "postgresql",
  :database => "contact_list"
})

ActiveRecord::Base.logger = Logger.new(STDOUT)
