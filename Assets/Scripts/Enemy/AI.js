#pragma strict

// General constants
public var followSpeed : float = 4.5;
public var resetSpeed : float = 3.5;
public var followStoppingDistance : float = 12.0;
public var resetStoppingDistance : float = 1.0;

// Death constants
public var finalOffset : float = 0.5;
public var deathRestDuration : float = 3.0;

// Shooting constants
public var damagePerShot : int = 20;
public var timeBetweenBullets : float = 3.0;
public var effectDuration : float = 1.0;
public var queueTime : float = 1.0;
public var shootRangeHorizontal : float = 20.0;
public var shootDecline : float = 10.0;

// General references
private var status : EnemyStatus;
private var sight : Sight;
private var nav : NavMeshAgent;
private var particles : ParticleManager;
private var audioC : AudioController;

// Starting position
private var resetPosition : Vector3;
private var resetRotation : Quaternion;

// Shooting
private var timer : float = 0.0;
private var shootRay : Ray;
private var shootHit : RaycastHit;
private var shootLine : LineRenderer;
private var enemyLight : Light;
private var shootTarget : Vector3;
private var shotQueued : boolean = false;
private var shooting : boolean = false;
private var combat : boolean = false;
private var shootRange : float;
private var shootDeclineY : float;
private var playerVector : Vector3;

// Sphere management
private var sphereTimer : float = 0.0;
private var spherePhaseConstant : float = 3.5;
private var sphereAmplitudeConstant : float = 0.09;
private var rotationSpeedConstant : float = 8.0;
private var cachedDestination : Vector3;
private var initialOffset : float;

// Death
private var dying : boolean = false;
private var fallDuration : float;
private var deathDuration : float;
private var g : float = Mathf.Abs(Physics.gravity.y);

function Awake() {
    // Get references to components
    status = GetComponent(EnemyStatus);
    sight = GetComponent(Sight);
    nav = GetComponent(NavMeshAgent);
    particles = GetComponent(ParticleManager);
    audioC = GetComponent(AudioController);

    // Save the resting position and rotation
    resetPosition = transform.position;
    resetRotation = transform.rotation;

    // Configure the nav agent
    nav.updateRotation = false;

    // Configure the line renderer
    shootLine = GetComponent(LineRenderer);
    shootLine.enabled = false;
    shootLine.useWorldSpace = true;
    shootLine.SetColors(Constants.RED, Constants.RED);

    // Configure the light
    enemyLight = GetComponent(Light);
    enemyLight.color = Constants.GREEN;

    // Set up horizontal shoot distance
    shootDeclineY = Mathf.Tan(shootDecline * Mathf.Deg2Rad);
    shootRangeHorizontal = Mathf.Tan((90 - shootDecline) * Mathf.Deg2Rad) * nav.baseOffset;
    shootRange = shootRangeHorizontal / Mathf.Sin((90 - shootDecline) * Mathf.Deg2Rad);

    // Prepare for death animation
    initialOffset = nav.baseOffset;
    fallDuration = Mathf.Pow((initialOffset - finalOffset) / g, 0.5);
    deathDuration = fallDuration + deathRestDuration;
}

function Update() {
    timer += Time.deltaTime;

    if (status.IsAlive()) {
        if (!(shotQueued || shooting) || Mathf.Abs(nav.baseOffset - initialOffset) > 0.01) {
            sphereTimer += Time.deltaTime;
            nav.baseOffset = Mathf.Sin(sphereTimer * spherePhaseConstant) * sphereAmplitudeConstant + initialOffset;
        }

        // If we are shooting and should stop...
        if (shooting && timer >= effectDuration) {
            StopShooting();
        }

        if (sight.IsPlayerInSight()) {
            if (!combat) {
                EnterCombat();
            }

            if (!shooting && !shotQueued) {
                Follow();
            }

            var distanceToPlayer : float = Mathf.Abs((sight.GetLastSighting() - transform.position).magnitude);

            // If a shot is not queued and it is time for the next shot...
            if (distanceToPlayer <= shootRangeHorizontal && !shotQueued && timer >= timeBetweenBullets) {
                QueueShot();
            }

            // If a shot is queued and it is time to fire it...
            if (shotQueued && timer >= queueTime) {
                Shoot();
            }
        } else if (combat) {
            Abandon();
        }
    } else if (!dying) {
        Death();
    } else if (nav.baseOffset >= finalOffset) {
        sphereTimer += Time.deltaTime;
        nav.baseOffset = initialOffset - g * Mathf.Pow(sphereTimer, 2);
    } else {
        enemyLight.enabled = false;
    }
}

function EnterCombat() {
    audioC.PlayDiscovery();
    particles.RequestColor(Constants.YELLOW);
    enemyLight.color = Constants.YELLOW;
    sight.SetCombat(true);
    sight.Update();
    timer = 0.0;
    combat = true;

    var others : GameObject[] = FindObjectsOfType(GameObject);
    for (var other : GameObject in others) {
        var enemy : Transform = other.transform.Find(Constants.ENEMY);
        if (enemy != null) {
            var otherSight : Sight = enemy.GetComponent(Sight);
            if (otherSight != null) {
                otherSight.SetCombat(true);
            }
        }
    }
}

function Follow() {
    nav.destination = sight.GetLastSighting();
    nav.speed = followSpeed;
    nav.stoppingDistance = followStoppingDistance;
    nav.updateRotation = false;

    var flatVectorToTarget = sight.GetLastSighting() - transform.position;
    flatVectorToTarget.y = 0;
    var newRotation = Quaternion.LookRotation(flatVectorToTarget);
    transform.rotation = Quaternion.Slerp(transform.rotation, newRotation, Time.deltaTime * rotationSpeedConstant);
}

function Abandon() {
    combat = false;
    sight.SetCombat(false);
    StopShooting();

    enemyLight.color = Constants.GREEN;
    particles.RequestColor(Constants.GREEN);

    nav.destination = resetPosition;
    nav.speed = resetSpeed;
    nav.stoppingDistance = resetStoppingDistance;
    nav.updateRotation = false;

    var delta : Vector3 = transform.position - resetPosition;
    if (Mathf.Abs(delta.magnitude) <= resetStoppingDistance) {
        transform.position = resetPosition;
        transform.rotation = resetRotation;
    }
}

function Death() {
    sphereTimer = 0.0;
    audioC.PlayDeath();
    dying = true;
    particles.RequestStop();
    StopShooting();
    CacheDestinationAndStop();
    initialOffset = nav.baseOffset;
    Destroy(transform.parent.gameObject, deathDuration);
}

function StopShooting() {
    shooting = false;
    shootLine.enabled = false;
    enemyLight.color = Constants.YELLOW;
    particles.RequestColor(Constants.YELLOW);
    SetCachedDestination();
}

function QueueShot() {
    timer = 0.0;
    shotQueued = true;
    enemyLight.color = Constants.RED;
    particles.RequestColor(Constants.RED);
    CacheDestinationAndStop();
    playerVector = sight.GetLastSighting();
}

function Shoot() {
    timer = 0.0;
    shotQueued = false;
    shooting = true;
    shootLine.enabled = true;

    shootRay.origin = transform.position;
    shootRay.direction = (playerVector - shootRay.origin).normalized;

    if (Physics.Raycast(shootRay, shootHit, shootRange, Constants.IGNORE_RAYCAST_MASK)) {
        //print(shootHit.collider);
        var playerStatus : PlayerStatus = shootHit.collider.GetComponent(PlayerStatus);

        if (playerStatus != null) {
            playerStatus.TakeDamage(damagePerShot);
        }
        
        shootTarget = shootHit.point;
    } else {
        shootTarget = shootRay.origin + shootRay.direction * shootRange;
    }

    shootLine.SetPosition(0, transform.position);
    shootLine.SetPosition(1, shootTarget);
    audioC.PlayShoot();
}

function InCombat() {
    return combat;
}

function SetCachedDestination() {
    nav.destination = cachedDestination;
}

function CacheDestinationAndStop() {
    cachedDestination = nav.destination;
    nav.destination = transform.position;
}

function EnableLight() {
    enemyLight.enabled = true;
}

function DisableLight() {
    enemyLight.enabled = false;
}
