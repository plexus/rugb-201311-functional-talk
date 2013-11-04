require 'slippery'
require 'fileutils'
require 'tempfile'
require_relative 'watch_task'

FNAME          = 'functional_ruby'
TITLE          = 'Functional Programming in Ruby'
SELF_CONTAINED = true

extend Slippery::ProcessorHelpers::ClassMethods

desc 'watch the presentation and theme for changes and rebuild'
watch ['functional_ruby.md', 'stylesheets/stylesheet.css', 'images', 'javascripts'] do
  dest = Tempfile.new(FNAME + '.html')
  File.open(FNAME + '.html') { |src| FileUtils.copy_stream(src, dest) }
  dest.close
  Rake::Task['build'].execute
  puts "="*80
  print `diff -u #{dest.path} #{FNAME}.html`
end

desc 'build the presentation html'
task :build do
  Dir['*.md'].each do |infile|
    doc = markdown_to_doc(infile)
    File.write(infile.sub(/md$/, 'html'), doc.to_html)
  end
end

task :toc do
  doc = markdown_to_doc("#{FNAME}.md").select('.heading') do |heading|
    puts "- #{heading.text.strip}"
  end
end

def markdown_to_doc(infile)
  include Slippery::Processors

  doc = Slippery::Document.new(File.read(infile))
  doc = Slippery::Presentation.new(doc,
    type: :reveal_js,
    theme: 'beige',
    controls: false,
    backgroundTransition: 'slide',
    history: true,
    plugins: [:notes]
  )

  doc = doc.process(
    GraphvizDot.new('.language-dot'),
    add_custom_assets,
    init_highlighting,
    set_prettyprint_classes,
    set_heading_background_color,
    split_subsection_slides,
    split_bigsection_slides,
    override_svg_font,
    notes,
  )

  doc = SelfContained.(doc) if SELF_CONTAINED
  doc
end

processor :set_prettyprint_classes, '[class~=language-ruby] code' do |code|
  code.add_class('prettyprint ruby')
end

processor :set_heading_background_color, '.heading' do |section|
  section.attr('data-background-color',"#4d7e65")
end

processor :split_subsection_slides, '.subsections' do |section|
  section.add_class('fragmented').map_children.with_index do |ch, idx|
    (ch.tag == :p && idx > 1) ? ch.add_class('fragment') : ch
  end
end

processor :notes, '.language-notes' do |notes|
  notes.set_tag(:aside).add_class('notes').set_children(notes.text.split("\n").flat_map{|n| [n, H[:br]]})
end

processor :split_bigsection_slides, '.bigsections p' do |para|
  H[:section, para].add_class(:big)
end

processor :override_svg_font, 'svg text[font-family]' do |text|
  text.attr('font-family', 'Raleway')
end

processor :add_custom_assets, 'head' do |h|
  h <<= H[:title, TITLE]
  h <<= H[:link, rel: 'stylesheet', href: file_uri_relative('stylesheets/stylesheet.css')]
  h <<= H[:link, rel: 'stylesheet', href: file_uri_relative('stylesheets/highlight.css')]
  h <<= H[:link, rel: 'stylesheet', href: 'http://fonts.googleapis.com/css?family=Raleway']
  h <<= H[:link, rel: 'stylesheet', href: 'http://fonts.googleapis.com/css?family=Inconsolata']
  h <<= H[:script, src: 'http://code.jquery.com/jquery-1.10.1.min.js']
  h <<= H[:script, src: file_uri_relative('javascripts/impress_js_addons.js')]
  h <<= H[:script, src: file_uri_relative('javascripts/highlight.pack.js')]
  h <<= H[:script, 'hljs.initHighlightingOnLoad();']
end

processor :init_highlighting, 'body' do |body|
  body.add_child(H[:script, '$("code").each(function(i,e){hljs.highlightBlock(e);});'])
end

def file_uri_relative(path)
  "file://#{File.expand_path(File.join('..', path), __FILE__)}"
end

task :default => "build"
