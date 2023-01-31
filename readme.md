# Backup of the PostgreSQL database to Cloudinary

This NodeJS script backs up a PostgreSQL database every day. The backup is sent to Cloudinary for secure storage.

## Prerequisites

- NodeJS installed on your computer
- Cloudinary account
- PostgreSQL database

## Installation

- Clone this repository on your computer
- Open a terminal in the application directory
- Run the npm install command to install the dependencies
- Update `exemple.env` file to `.env` and add your Cloudinary credentials, Cloudinary folder directory, the database credentials and the schedule of the backup.
- Run `npm run start` command to start the application
Usage
- The script automatically starts every day at the hour define in `.env` and backs up the database. The backups are sent to Cloudinary and the local files are deleted.

If you want to add other databases, just update them to the `.env` file following the same format.
