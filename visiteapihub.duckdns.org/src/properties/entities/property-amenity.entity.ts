import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('property_amenities')
export class PropertyAmenity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Education
  @Column({ default: false })
  educationMaternal: boolean;

  @Column({ default: false })
  educationPrimere: boolean;

  @Column({ default: false })
  educationCollege: boolean;

  @Column({ default: false })
  educationLycee: boolean;

  @Column({ default: false })
  educationUniversite: boolean;

  @Column({ default: false })
  educationEspaceDeLoisir: boolean;

  // Medical
  @Column({ default: false })
  medicalsHopital: boolean;

  @Column({ default: false })
  medicalsPharmacie: boolean;

  @Column({ default: false })
  medicalsClinique: boolean;

  @Column({ default: false })
  medicalsLaboratoire: boolean;

  // Leisure
  @Column({ default: false })
  loisirParc: boolean;

  @Column({ default: false })
  loisirGym: boolean;

  @Column({ default: false })
  loisirBibliotheque: boolean;

  @Column({ default: false })
  loisirTheatre: boolean;

  @Column({ default: false })
  loisirTerrains: boolean;

  @Column({ default: false })
  loisirMall: boolean;

  // Transport
  @Column({ default: false })
  transportBus: boolean;

  @Column({ default: false })
  transportTrameway: boolean;

  @Column({ default: false })
  transportMetro: boolean;

  @Column({ default: false })
  transportTrain: boolean;

  // Internal
  @Column({ default: false })
  internParking: boolean;

  @Column({ default: false })
  internGarageIndividuel: boolean;

  @Column({ default: false })
  internParkingCollectif: boolean;

  @Column({ default: false })
  internJardin: boolean;

  @Column({ default: false })
  internPiscine: boolean;

  @Column({ default: false })
  internLoisir: boolean;

  @Column({ default: false })
  internSafe: boolean;

  @Column({ default: false })
  internCamera: boolean;

  @Column({ default: false })
  internPolice: boolean;

  @Column({ default: false })
  internInfirmerie: boolean;

  @Column({ default: false })
  internAscenseurs: boolean;

  @Column({ default: false })
  internGym: boolean;

  @Column({ type: 'text', nullable: true })
  descriptionAccomodité: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}