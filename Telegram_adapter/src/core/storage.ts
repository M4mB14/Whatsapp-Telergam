import { 
    StorageProvider, 
    BaseUser, 
    Instance 
} from '@green-api/greenapi-integration';

export class TelegramStorage extends StorageProvider {
    private users = new Map<string, BaseUser>();
    private instances = new Map<number, Instance>();

    async createInstance(instance: Instance): Promise<Instance> {
        this.instances.set(Number(instance.idInstance), instance);
        return instance;
    }

    async getInstance(idInstance: number): Promise<Instance | null> {
        return this.instances.get(idInstance) || null;
    }

    async removeInstance(instanceId: number): Promise<Instance> {
        const instance = this.instances.get(instanceId);
        if (!instance) throw new Error('Instance not found');
        
        this.instances.delete(instanceId);
        return instance;
    }

    async createUser(data: any): Promise<BaseUser> {
        const user = { id: Date.now(), ...data };
        this.users.set(data.email, user);
        return user;
    }

    async findUser(identifier: string): Promise<BaseUser | null> {
        return this.users.get(identifier) || null;
    }

    async updateUser(identifier: string, data: any): Promise<BaseUser> {
        const user = await this.findUser(identifier);
        if (!user) throw new Error('User not found');
        
        const updated = { ...user, ...data };
        this.users.set(identifier, updated);
        return updated;
    }
}