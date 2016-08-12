require 'sinatra'
require 'sinatra/reloader'

# configure(:development){set :database, "sqlite3:database.sqlite3"}
c

get '/' do
  erb :level
end