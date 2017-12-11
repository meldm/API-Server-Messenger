##Messenger

HTTPS-server(express) with API, chat-rooms(socket.io) and saving all conversation(mongodb + mongoose).


###[Structure ☜](./README-Structure.md)


###[API ☜](./README-API.md)


###[Examples of output data ☜](./README-Examples.md)


###[Models ☜](./README-Models.md)


###How to run?
Type in console:
```bash
# clone
git clone https://github.com/meldm/API-Server-Messenger.git
cd API-Server-Messenger

# to install all the package dependencies locally
npm install

# and run
npm run dev
```


###How to run local mongodb?
```bash
# start
sudo systemctl start mongodb
# status
sudo systemctl status mongodb
# stop
sudo systemctl stop mongodb
```


###How to import DB of mongodb?
Download the file gm.json and type in console:
```bash
sudo mongoimport --db gm --collection <name_of_collection> --file gm.json
```


###How to export DB of mongodb?
```bash
sudo mongoexport --db gm -c <name_of_collection> --out gm.json
```
Don't forget that the file gm.json must be stored in the folder ./config


###How to work with git?
```bash
# information about your changes
git status [branch]

# pull to changes
git pull <name_of_the_remote_server_is_usually_origin> <name_of_your_brach> 
# if you want pull to changes of the master branch
git pull origin master

# to start version control all files
git add .
# or a specific file
git add <name_of_changed_file> <or_files> mayby with </directory/changed_file> or just </directory_with_changed_files/>

# сommit changes
git commit -m '<v0.0 Text commit>'

# pushing
git push <name_of_the_remote_server_is_usually_origin> <name_of_your_branch>
# if you want pushing how master!
git push origin master

# if you want create new(your) branch
git branch <name_of_new_branch_for_example_testing>
# for to go to the branch existing
git checkout <testing>
```


###Used:
- elementary OS 0.4.1 Loki (Built on "Ubuntu 16.04.3 LTS")
- node v6.9.5
- npm v3.10.10
- nodemon v1.11.0
- express v4.15.4
- socket.io v2.0.3
- mongodb v3.2.16
- robomongo v0.9.0
- nodemailer v4.1.0
- cloudinary v1.9.0


###Links:
- [Testing API](https://www.getpostman.com/)
