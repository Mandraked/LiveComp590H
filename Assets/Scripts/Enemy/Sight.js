#pragma strict

public var restingFieldOfViewAngle : float = 360.0;
public var combatFieldOfViewAngle : float = 360.0;
public var restingSightRadius : float = 18.0;
public var combatSightRadius : float = 35.0;
public var assuredSightRadius : float = 6.0;
public var lightRadius : float = 45.0;

private var playerInSight : boolean;
private var lastSighting : Vector3;
private var combat : boolean;
private var fieldOfViewAngle : float;
private var sightRadius : float;

private var ai : AI;
private var player : GameObject;

private static var hostile : boolean;

function Awake() {
    ai = GetComponent(AI);
    player = GameObject.FindGameObjectWithTag(Constants.PLAYER);
    combat = false;
    hostile = false;
}

function Update() {
    //print(hostile);
    //hostile = true;
    if (hostile) {
        var playerVector : Vector3 = player.transform.position - transform.position;
        var playerDistance: float = Mathf.Abs(playerVector.magnitude);

        if (playerDistance <= lightRadius) {
            ai.EnableLight();
        } else {
            ai.DisableLight();
        }

        if (playerDistance <= assuredSightRadius) {
            combat = true;
        }

        if (combat) {
            sightRadius = combatSightRadius;
            fieldOfViewAngle = combatFieldOfViewAngle;
        } else {
            sightRadius = restingSightRadius;
            fieldOfViewAngle = restingFieldOfViewAngle;
        }

        if (playerDistance <= sightRadius) {
            playerInSight = false;
    
            var angle : float = Vector3.Angle(playerVector, transform.forward);

            if (angle < fieldOfViewAngle * 0.5) {
                var hit : RaycastHit;
                if (false) {
                    RegisterSighting();
                } else if (Physics.Raycast(transform.position, playerVector.normalized, hit, sightRadius, Constants.IGNORE_RAYCAST_MASK)) {
                    //print(hit.collider);
                    if (hit.collider.gameObject == player) {
                        RegisterSighting();
                    }
                }
            }
        } else {
            playerInSight = false;
        }
    }
}

function IsPlayerInSight() {
    return playerInSight;
}

function GetLastSighting() {
    return lastSighting;
}

function SetCombat(combat : boolean) {
    this.combat = combat;
}

function RegisterSighting() {
    playerInSight = true;
    lastSighting = player.transform.position;
}

static function GetHostile() {
    return hostile;
}

static function SetHostile(hostile : boolean) {
    this.hostile = hostile;
}