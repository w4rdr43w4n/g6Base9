# Do this after installing postgresql correctly
echo "Creating db named : main"
sudo -u postgres createdb <db_name>
sudo -u postgres createuser <username>
# Then run:
sudo -i -u postgres && psql
# Run the following commands as the use postgres, and in psql shell:
alter user <username> with encrypted password '<password>';
grant all privileges on database <dbname> to <username>

