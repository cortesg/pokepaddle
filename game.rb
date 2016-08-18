require 'sinatra'
require "sinatra/activerecord"
require "sinatra/flash"
require "./models"

# configure(:development){set :database, "sqlite3:database.sqlite3"}

get '/' do
	erb :index
end

get '/game' do
	erb :level
end

get '/highscore' do
	erb :highscore
end