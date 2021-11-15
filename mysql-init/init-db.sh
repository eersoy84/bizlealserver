#!/bin/bash
   set -e
   echo "******Restoring MySql from lastet backup******"
   
   echo "Logging as => $USER" 
   
   if [ -d "${BACKUP_DIR}" ] 
    then
		echo "Directory ${BACKUP_DIR} exists." 
    else
		echo "Error: Directory /backups does not exists."
		exit 1
    fi
   
 latest_backup=$(ls -t ${BACKUP_DIR}/*tgz | head -n1);
 echo "Latest backup: => $latest_backup";

 base_name=$(basename -s .tgz $latest_backup); 
 echo "file name:" ${base_name}
 tar -xf $latest_backup --no-overwrite-dir -C /tmp || (echo "Error, unzip failed"; exit 1;);
 latest_sql_file=$(ls -t /tmp/*sql | head -n1);
 echo "latest sql file: " $latest_sql_file;
 echo "Sql backup file copied to /tmp directory...";
 echo "Initializing restore...";
 mysql --host=localhost --user=root --password=${MYSQL_ROOT_PASSWORD} -D ${MYSQL_DATABASE} < ${latest_sql_file} || (echo "Error, restore failed"; exit 1;);
 echo "DATABASE ${MYSQL_DATABASE} successfully restored";


