require 'sinatra'

get '/' do
	erb :index
end

get '/game' do
	erb :level
end

get '/highscore' do
	erb :highscore
end