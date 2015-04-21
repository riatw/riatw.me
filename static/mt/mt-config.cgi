## Movable Type Configuration File
##
## This file defines system-wide
## settings for Movable Type. In
## total, there are over a hundred
## options, but only those
## critical for everyone are listed
## below.
##
## Information on all others can be
## found at:
##  http://www.movabletype.jp/documentation/config

#======== REQUIRED SETTINGS ==========

CGIPath        /mt/
StaticWebPath  /mt/mt-static/
StaticFilePath /var/www/riatw.me/mt/mt-static

#======== DATABASE SETTINGS ==========

ObjectDriver DBI::mysql
Database riatw
DBUser root
DBPassword nudyznmb
DBHost localhost

#======== MAIL =======================

MailTransfer sendmail
SendMailPath /usr/lib/sendmail

DefaultLanguage ja

ImageDriver ImageMagick

AdminScript mt.fcgi
