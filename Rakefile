require 'fileutils'

task :publish do
  FileUtils.rm_rf('/tmp/trotter-blog-index')
  ENV['GIT_INDEX_FILE'] = '/tmp/trotter-blog-index'
  sh "jekyll generated"
  sh "cd generated && GIT_DIR=../.git git add ."
  tsha = `git write-tree`.chomp
  csha = `echo 'updated' | git commit-tree #{tsha}`.chomp
  sh "git update-ref refs/heads/master #{csha}"
  FileUtils.rm_rf("generated")
  sh "git push -f origin master"
end
