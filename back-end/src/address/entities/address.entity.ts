
import { User } from 'src/users/entities/user.entity'
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'

@Entity('address')
export class Address {
    @PrimaryGeneratedColumn()
    address_id: number

    @Column()
    user_id: number

    @Column({ type: 'float', nullable: true })
    lat: number

    @Column({ type: 'float', nullable: true })
    lng: number

    @Column({ default: false })
    is_default: boolean

    @Column({ type: 'timestamp', default: () => 'now()' })
    created_at: Date

    @Column({ nullable: true })
    fullname: string

    @Column({ nullable: true })
    phone: string

    @Column({ nullable: true })
    address_detail: string

    @Column({ nullable: true })
    sub_district: string

    @Column({ nullable: true })
    district: string

    @Column({ nullable: true })
    province: string

    @Column({ nullable: true })
    zipcode: string




    @ManyToOne(() => User, (user) => user.addresses)
    @JoinColumn({ name: 'user_id' })
    user: User;
}