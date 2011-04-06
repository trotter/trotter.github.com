require 'fileutils'

task :publish do
  FileUtils.rm_rf('/tmp/trotter-blog-index')
  ENV['GIT_INDEX_FILE'] = '/tmp/trotter-blog-index'
  sh "jekyll generated"
  sh "git add -f generated"
  tsha = `git write-tree`.chomp
  puts `git rm -rf generated`
  sh "git read-tree #{tsha}:generated"
  tsha = `git write-tree`.chomp
  csha = `echo 'updated' | git commit-tree #{tsha}`.chomp
  sh "git update-ref refs/heads/generated #{csha}"
end
