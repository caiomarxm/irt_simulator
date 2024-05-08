# IRT Simulator

Hello there! Nice to have you here =D


IRT Simulator is a web application that simulates the correction method of ENEM, which is
an unified college entrance exam (similar to SAT).


In portuguese, ENEM stands for National Highschool Exam (hence the NHE on some pages of the application)


Soon some nice descriptions will be added to this page, such as screenshots of the application and a study
on the probabilistic aspect of the IRT (Item Response Theory) method, that considers the difficulty of the
questions as well as a guess factor to get possible exam cheaters :D


## Development

To run the development server you must (currently) start both the frontend and the backend servers.


The backend server can be started by running `docker compose up --build -d` on the root folder.
Make sure you have docker compose installed and rename your `/backend/.env.example` to `/backend/.env`.


The frontend server runs on node v12.22.9, make sure you have it installed on your machine (currently
is not on docker compose stack). To start the server, run `npm run dev` inside the `/frontend` folder.

Now you should have everything up and running!
