require 'sinatra'
require "sinatra/activerecord"
require "sinatra/flash"
require "./models"
require "sinatra/cookies"

configure(:development){set :database, "sqlite3:database.sqlite3"}

get '/' do
	erb :index
end

get '/game' do
	erb :level
end

post "/game" do
	User.create(
		name: params[:name],
		time: params[:time]
	)
	redirect "/highscore"  
end

get '/highscore' do
	@users = User.all.last(10).reverse!
	@name = cookies[:person_cookie]
	@time = cookies[:fastest_time_cookie]
	erb :highscore
end