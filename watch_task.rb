require 'rb-inotify'

class WatchTask
  def initialize(name, files, &block)
    Rake::Task.define_task name do
      Array(files).each do |pattern|
        notifier.watch(pattern, :modify, &block)
      end
      at_exit do
        block.call
        notifier.run
      end
    end
  end

  def notifier
    @notifier ||= INotify::Notifier.new
  end
end

def watch(files, name = :watch, &block)
  WatchTask.new(name, files, &block)
end
