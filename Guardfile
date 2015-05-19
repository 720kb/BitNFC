# gem install guard-haml guard-sass

# guard init sass
# guard init haml

##########

guard 'sass', :input => 'assets/sass', :output => 'assets/css'

# Sample guardfile block for Guard::Haml
# You can use some options to change guard-haml configuration
# output: 'public'                   set output directory for compiled files
# input: 'src'                       set input directory with haml files
# run_at_start: true                 compile files when guard starts
# notifications: true                send notifictions to Growl/libnotify/Notifu
# haml_options: { ugly: true }    pass options to the Haml engine

guard :haml do
  watch(/^.+(\.html\.haml)$/)
end
