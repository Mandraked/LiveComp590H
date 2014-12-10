#pragma strict

// The speed the bullet moves 
   var Speed : float = .4; 
   static var damagePerShot : int = 20;
   
   // The number of seconds before the bullet is automatically destroyed 
   var SecondsUntilDestroy : float = 3; 
   
   private var startTime : float; 
   
   function Start () {
       startTime = Time.time;
   } 
   
   function FixedUpdate () {
     // Move forward 
     this.gameObject.transform.position -= Speed * this.gameObject.transform.right;
     
     // If the Bullet has existed as long as SecondsUntilDestroy, destroy it 
     if (Time.time - startTime >= SecondsUntilDestroy) {
         Destroy(this.gameObject);
     }
   }
        
   function OnCollisionEnter(collision : Collision) {
       //print("COLLISION Laser Bullet: "+collision.gameObject);
       // var enemyStatus : EnemyStatus = collision.gameObject.GetComponent(EnemyStatus);
       
       // if (enemyStatus != null) {
       //     enemyStatus.TakeDamage(damagePerShot);
       // }
       
       // Remove the Bullet from the world 
       Destroy(this.gameObject); 
   }