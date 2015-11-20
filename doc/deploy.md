Manuel de déploiement
=====================

## Déploiement sur un serveur Amazon Linux

### Mise à jour du serveur :

```bash
$ sudo yum update
```

### Installation de nodejs :

Faire ceci:
```bash
$ sudo curl --silent --location https://rpm.nodesource.com/setup | bash -
```
Ensuite cela:
```bash
$ sudo yum -y install nodejs
```

### Mise à jour de nodejs

```bash
$ sudo npm cache clean -f
$ sudo npm install -g n
$ sudo n stable
$ sudo n
```
Choisir la version et presser "enter"(bonne chance)
node devrait être en version 5.0.0 (au 16/11/2015)

### Installation de forever :

Forever est un package nodejs permettant d'executer des programmes en tâches de fond (non dépendantes d'un terminal).

```bash
$ sudo npm install forever -g
```

### Installation de MongoDB :

* Il faut d'abord créer un fichier de configuration du repository pour que MongoDB puisse être installé avec yum.
Créer le fichier :

```bash
$ sudo cat > /etc/yum.repos.d/mongodb-org-3.0.repo <<EOF
[mongodb-org-3.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/amazon/2013.03/mongodb-org/3.0/x86_64/
gpgcheck=0
enabled=1
EOF
```

 _Attention pour les versions de MongoDB inférieur à la 3.0,
 veuillez vous référer à la doc officielle disponible [ici](https://docs.mongodb.org/v3.0/tutorial/install-mongodb-on-amazon/)_
 
```bash 
$ sudo yum -y install mongodb-org
```

### Installation du projet via github :
 
* ***Prérequis***: `git` doit être installé sur votre machine.  
 
 Pour installer git sur votre machine :
 
```bash
$ sudo yum -y install git
```
 
* Cloner le projet dans un répertoire de votre choix (<dir>) via github. Utiliser la commande suivante :
 
 ```bash
$ cd <dir>
$ sudo git clone https://github.com/jlguenego/cpw.git
```
 
### Installation des packages du projet :

Pour que le projet fonctionne, vous devez installer l'ensemble des dépendances avec cette commande :

 ```bash
$ cd <dir>
$ cd cpw
$ sudo npm install
```
 
## Utilisation du projet :
 
### Démarrer une instance MongoDB.
 
```bash
$ sudo service mongod start
```

Pour plus d'information voir la documentation de MongoDB.
https://docs.mongodb.org/manual/tutorial/install-mongodb-on-amazon/
 
Créer un fichier `config.js` à partir du fichier `config.js.tmpl` avec les réglages de votre choix.
```bash
$ cp config.js.tmpl config.js
$ vi config.js
```

### Démarrer le serveur web (Express)
 
 ```bash
 $ cd <dir>
 $ cd cpw
 $ sudo forever start server.js
 ```
 
 et rendez-vous dans votre explorateur internet à l'adresse de votre machine.
 
 Pour stopper le serveur :
 ```bash
 $ cd <dir>
 $ cd cpw
 $ sudo forever stop server.js
 ```
 
 Pour stopper la base MongoDB :
 ```bash
 $ sudo service mongod stop
 ```

### Déployer la dernière version

 ```bash
git fetch origin
git reset --hard origin/master
```
