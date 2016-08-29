require "sinatra/activerecord/rake"
require "./game"

namespace :db do
  task :load_config do
    require File.expand_path('../game', __FILE__)
  end
end