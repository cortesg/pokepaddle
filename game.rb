require 'sinatra'
require "sinatra/activerecord"
require "sinatra/flash"
require "./models"
require "sinatra/cookies"

configure(:development){set :database, "sqlite3:database.sqlite3"}

get '/' do
	@users = User.all.sort_by { |x| x[:time] }
	@name = cookies[:person_cookie]
	@time = cookies[:fastest_time_cookie]
	erb :index
end

get '/game' do
	erb :level
end

post "/game" do
	User.create(
		name: cookies[:person_cookie],
		time: cookies[:fastest_time_cookie]
	)
	redirect "/"  
end

get '/ghost' do
	erb :ghost_level
end

post "/ghost" do
	User.create(
		name: cookies[:person_cookie],
		time: cookies[:fastest_time_cookie]
	)
	redirect "/"  
end
