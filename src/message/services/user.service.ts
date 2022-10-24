import { Injectable } from "@nestjs/common";

@Injectable()
export class UserService {
    
  clients = new Map();
  
  constructor(){}

  public getMap(){
    return this.clients;
  }
}
